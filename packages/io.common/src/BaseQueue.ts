import { PassThrough } from "stream";
import * as crypto from "crypto";
import {
  Client,
  Producer,
  Consumer,
  Reader,
  MessageId,
  Message,
  LogLevel,
} from "pulsar-client";
import { HttpException, HttpStatus } from "@nestjs/common";
import { type BaseOptions } from "./BaseOptions";
import { BaseLogger } from "./BaseLogger";

export abstract class BaseQueue {
  /**
   * Pulsar client.
   */
  private _client: null | Client = null;

  /**
   * Queries topic producer.
   */
  private _queriesProducer: null | Producer = null;

  /**
   * Queries topic consumer.
   */
  private _queriesConsumer: null | Consumer = null;

  /**
   * Returns options object.
   */
  protected abstract options(): BaseOptions;

  /**
   * Returns logger instance.
   */
  protected abstract logger(): BaseLogger;

  /**
   * Ensures that the queries queue exists.
   */
  protected async ensureQueries(): Promise<void> {
    const stats = await this.stats("queries");
    if (!stats) {
      await this.create("queries");
    }
  }

  /**
   * Returns specified `topic` stats if exist or `null` otherwise.
   * @throws
   */
  protected async stats(
    topic: string,
  ): Promise<null | { numberOfEntries: number }> {
    const apiURL =
      `http://${this.options().getQueueHost()}` +
      `:${this.options().getQueueRestPort()}` +
      "/admin/v2/persistent" +
      `/${this.options().getQueueTenant()}` +
      `/${this.options().getQueueNamespace()}` +
      `/${topic}/internalStats`;
    const response = await fetch(apiURL, {
      method: "GET",
      cache: "no-cache",
    });
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const message = `${response.status} ${response.statusText}`;
      this.logger().error(message);
      throw new Error(message);
    }
    const status = <{ numberOfEntries: number }>await response.json();
    return status;
  }

  /**
   * Creates specified persistent non-partitioned `topic`.
   * @throws
   */
  protected async create(topic: string): Promise<void> {
    const apiURL =
      `http://${this.options().getQueueHost()}` +
      `:${this.options().getQueueRestPort()}` +
      "/admin/v2/persistent" +
      `/${this.options().getQueueTenant()}` +
      `/${this.options().getQueueNamespace()}` +
      `/${topic}`;
    const response = await fetch(apiURL, {
      method: "PUT",
      cache: "no-cache",
    });
    if (!response.ok) {
      const message = `${response.status} ${response.statusText}`;
      this.logger().error(message);
      throw new Error(message);
    }
    return;
  }

  /**
   * Deletes specified persistent `topic`.
   * @throws
   */
  protected async delete(topic: string): Promise<void> {
    const apiURL =
      `http://${this.options().getQueueHost()}` +
      `:${this.options().getQueueRestPort()}` +
      "/admin/v2/persistent" +
      `/${this.options().getQueueTenant()}` +
      `/${this.options().getQueueNamespace()}` +
      `/${topic}`;
    const response = await fetch(apiURL, {
      method: "DELETE",
      cache: "no-cache",
    });
    if (!response.ok) {
      const message = `${response.status} ${response.statusText}`;
      this.logger().error(message);
      throw new Error(message);
    }
    return;
  }

  /**
   * Returns configured queries producer.
   */
  protected async queriesProducer(): Promise<Producer> {
    if (!this._queriesProducer) {
      this._queriesProducer = await this.client().createProducer({
        topic: "queries",
      });
    }
    return this._queriesProducer;
  }

  /**
   * Returns configured queries producer.
   */
  protected async queriesConsumer(
    listener?: (message: Message, consumer: Consumer) => void,
  ): Promise<Consumer> {
    if (!this._queriesConsumer) {
      this._queriesConsumer = await this.client().subscribe({
        topic: "queries",
        subscription: "querier",
        subscriptionType: "Shared",
        listener,
      });
    }
    return this._queriesConsumer;
  }

  /**
   * Returns `name` topic producer.
   */
  protected async dataProducer(name: string): Promise<Producer> {
    return await this.client().createProducer({
      topic: name,
    });
  }

  /**
   * Returns `name` topic reader.
   */
  protected async dataReader(
    name: string,
    stream: PassThrough,
  ): Promise<Reader> {
    return await this.client().createReader({
      topic: name,
      readerName: name,
      startMessageId: MessageId.earliest(),
      // This cause a "segmentation fault (core dumped)" error.
      // listener: (message, reader) => {
      //   switch (message.getProperties().state) {
      //     case "PROCESSING":
      //       break;
      //     case "SCHEMA":
      //       stream.write(message.getData());
      //       break;
      //     case "CHUNK":
      //       stream.write(message.getData());
      //       break;
      //     case "DONE":
      //       reader.close().catch((reason) => {
      //         this.logger().error(reason);
      //       });
      //       stream.end();
      //       break;
      //     case "FAIL":
      //       reader.close().catch((reason) => {
      //         this.logger().error(reason);
      //       });
      //       stream.destroy(
      //         new HttpException(
      //           message.getProperties().error,
      //           HttpStatus.FAILED_DEPENDENCY,
      //         ),
      //       );
      //       break;
      //   }
      // },
    });
  }

  /**
   * Returns configured queue client instance.
   */
  protected client(): Client {
    if (!this._client) {
      this._client = new Client({
        serviceUrl:
          `pulsar://${this.options().getQueueHost()}` +
          `:${this.options().getQueuePort()}`,
        // ioThreads: 10,
        // messageListenerThreads: 10,
        log: (
          level: LogLevel,
          file: string,
          line: number,
          message: string,
        ) => {
          switch (level) {
            case LogLevel.DEBUG:
              this.logger().debug(message);
              break;
            case LogLevel.INFO:
              this.logger().log(message);
              break;
            case LogLevel.ERROR:
              this.logger().error(message);
              break;
            case LogLevel.WARN:
              this.logger().warn(message);
              break;
          }
        },
      });
    }
    return this._client;
  }

  /**
   * Returns persistent hash for the provided `sql` string.
   */
  protected getHashname(sql: string): string {
    const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    const buffer = crypto
      .createHash("md5")
      .update(JSON.stringify(sql))
      .digest();

    let hashname = "";
    let residue = 0;
    let counter = 0;
    for (let i = 0; i < 5; i++) {
      const byte = buffer.readUInt8(i);
      counter += 8;
      residue = (byte << (counter - 8)) | residue;
      while (residue >> 5) {
        hashname += charset.charAt(residue % 32);
        counter -= 5;
        residue = residue >> 5;
      }
    }
    hashname += charset.charAt(residue % 32);
    return hashname;
  }

  /**
   * Returns persistent hash for the provided `timestamp` rounded by
   * the queue cache timeout value.
   */
  protected getHashtime(timestamp: number): string {
    return Math.floor(
      timestamp / this.options().getQueueCacheTimeout(),
    ).toString(32);
  }

  /**
   * Returns a timestamp fetched from the provided `hashtime` value.
   */
  protected getTimestamp(hashtime: string): Date {
    return new Date(
      parseInt(hashtime, 32) * this.options().getQueueCacheTimeout(),
    );
  }
}

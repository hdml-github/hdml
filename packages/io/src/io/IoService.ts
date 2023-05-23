import * as crypto from "crypto";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Client, Producer, LogLevel } from "pulsar-client";
import { OptionsService } from "../options/OptionsService";

@Injectable()
export class IoService implements OnModuleInit {
  /**
   * Service logger.
   */
  private readonly _logger = new Logger(IoService.name, {
    timestamp: true,
  });

  /**
   * Pulsar client.
   */
  private _client: null | Client = null;

  /**
   * Queries topic producer.
   */
  private _queriesProducer: null | Producer = null;

  /**
   * Class constructor.
   */
  public constructor(private readonly options: OptionsService) {}

  /**
   * Module initialized callback.
   */
  public onModuleInit(): void {
    this._logger.log("Running IO");
    this.runWorkflow().catch((reason) => {
      this._logger.error(reason);
    });
  }

  public async test(): Promise<string> {
    const topic =
      `${this.getHashname("sql query")}.` +
      `${this.getTimehash(Date.now())}`;
    const status = await this.isTopicExist("topic hash");
    return JSON.stringify(status, undefined, 2);
  }

  /**
   * Runs async workflow.
   */
  private async runWorkflow(): Promise<void> {
    await this.assertQueries();

    // const producer = await this._client.createProducer({
    //   topic: "topic.hash",
    // });
    // const consumer = await this._client.subscribe({
    //   topic: "topic.hash",
    //   subscription: "subscription",
    // });

    // await producer.send({
    //   data: Buffer.from("Hello, Pulsar"),
    // });
    // const msg = await consumer.receive();

    // await consumer.acknowledge(msg);
    // await consumer.close();
    // await producer.close();

    return Promise.resolve();
  }

  private async assertQueries(): Promise<void> {
    const stats = await this.stats("queries");
    if (!stats) {
      await this.create("queries");
    }
    await this.getQueriesProducer();
  }

  /**
   * Returns specified `topic` stats if exist or `null` otherwise.
   * @throws
   */
  private async stats(
    topic: string,
  ): Promise<null | { numberOfEntries: number }> {
    const apiURL =
      `http://${this.options.getQueueHost()}` +
      `:${this.options.getQueueRestPort()}` +
      "/admin/v2/persistent" +
      `/${this.options.getQueueTenant()}` +
      `/${this.options.getQueueNamespace()}` +
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
      this._logger.error(message);
      throw new Error(message);
    }
    const status = <{ numberOfEntries: number }>await response.json();
    return status;
  }

  /**
   * Creates specified persistent non-partitioned `topic`.
   * @throws
   */
  private async create(topic: string): Promise<void> {
    const apiURL =
      `http://${this.options.getQueueHost()}` +
      `:${this.options.getQueueRestPort()}` +
      "/admin/v2/persistent" +
      `/${this.options.getQueueTenant()}` +
      `/${this.options.getQueueNamespace()}` +
      `/${topic}`;
    const response = await fetch(apiURL, {
      method: "PUT",
      cache: "no-cache",
    });
    if (!response.ok) {
      const message = `${response.status} ${response.statusText}`;
      this._logger.error(message);
      throw new Error(message);
    }
    return;
  }

  /**
   * Deletes specified persistent `topic`.
   * @throws
   */
  private async delete(topic: string): Promise<void> {
    const apiURL =
      `http://${this.options.getQueueHost()}` +
      `:${this.options.getQueueRestPort()}` +
      "/admin/v2/persistent" +
      `/${this.options.getQueueTenant()}` +
      `/${this.options.getQueueNamespace()}` +
      `/${topic}`;
    const response = await fetch(apiURL, {
      method: "DELETE",
      cache: "no-cache",
    });
    if (!response.ok) {
      const message = `${response.status} ${response.statusText}`;
      this._logger.error(message);
      throw new Error(message);
    }
    return;
  }

  /**
   * Returns configured queries producer.
   */
  private async getQueriesProducer(): Promise<Producer> {
    if (!this._queriesProducer) {
      this._queriesProducer = await this.getClient().createProducer({
        topic: "queries",
      });
    }
    return this._queriesProducer;
  }

  /**
   * Returns configured queue client instance.
   */
  private getClient(): Client {
    if (!this._client) {
      this._client = new Client({
        serviceUrl:
          `pulsar://${this.options.getQueueHost()}` +
          `:${this.options.getQueuePort()}`,
        log: (
          level: LogLevel,
          file: string,
          line: number,
          message: string,
        ) => {
          switch (level) {
            case LogLevel.DEBUG:
              this._logger.debug(message);
              break;
            case LogLevel.INFO:
              this._logger.log(message);
              break;
            case LogLevel.ERROR:
              this._logger.error(message);
              break;
            case LogLevel.WARN:
              this._logger.warn(message);
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
  private getHashname(sql: string): string {
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
  private getTimehash(timestamp: number): string {
    return Math.floor(
      timestamp / this.options.getQueueCacheTimeout(),
    ).toString(32);
  }

  /**
   * Returns a timestamp fetched from the provided `timehash` value.
   */
  private getTimestamp(timehash: string): Date {
    return new Date(
      parseInt(timehash, 32) * this.options.getQueueCacheTimeout(),
    );
  }
}

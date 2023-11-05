/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  QueryDef,
  QueryBuf,
  QueryPathBuf,
  QueryState,
} from "@hdml/schema";
import {
  Injectable,
  OnModuleInit,
  StreamableFile,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import {
  Client,
  Producer,
  Consumer,
  MessageId,
  Message,
  LogLevel,
} from "pulsar-client";
import { PassThrough } from "stream";
import { getCliOpts } from "../helpers/getCliOpts";
import { Dataset } from "../querier/Dataset";
import { Config } from "./Config";
import { Logger } from "./Logger";
import { Threads } from "./Threads";

/**
 * Queries queues service class.
 */
@Injectable()
export class Queues implements OnModuleInit {
  private _uri: string;
  private _mode: "gateway" | "hideway" | "querier";
  private _logger: Logger;
  private _client: Client;
  private _qonsumer: null | Consumer = null;
  private _qroducer: null | Producer = null;

  /**
   * @constructor
   */
  public constructor(
    private _conf: Config,
    private _threads: Threads,
  ) {
    this._uri =
      `http://${this._conf.queueHost}` +
      `:${this._conf.queueRest}` +
      "/admin/v2/persistent" +
      `/${this._conf.queueTenant}` +
      `/${this._conf.queueNamespace}`;

    this._mode = getCliOpts().mode;

    this._logger = new Logger("Queues", this._threads);

    this._client = new Client({
      serviceUrl:
        `pulsar://` +
        `${this._conf.queueHost}:` +
        `${this._conf.queuePort}`,
      log: (
        level: LogLevel,
        _file: string,
        _line: number,
        message: string,
      ) => {
        switch (level) {
          case LogLevel.ERROR:
            this._logger.error(message);
            break;
          case LogLevel.WARN:
            this._logger.warn(message);
            break;
          case LogLevel.INFO:
            this._logger.log(message);
            break;
          case LogLevel.DEBUG:
            this._logger.debug(message);
            break;
        }
      },
    });
  }

  /**
   * Module initialization callback.
   */
  public async onModuleInit(): Promise<void> {
    await this.ensureTopic(this._conf.queueQueries);
    if (this._mode === "querier") {
      this._qonsumer = await this._client.subscribe({
        topic: this._conf.queueQueries,
        subscription: "querier",
        subscriptionType: "Shared",
        listener: this.qonsumerListener.bind(this),
      });
    } else {
      this._qroducer = await this._client.createProducer({
        topic: this._conf.queueQueries,
      });
    }
  }

  /**
   * Posts the specified `query` to the execution queue under the
   * specified `uri`. Returns a stream with the `QueryPath` buffer.
   */
  public async postQuery(
    uri: string,
    query: QueryDef,
  ): Promise<StreamableFile> {
    const exist = await this.ensureTopic(uri);
    if (!exist) {
      await this.createTopic(uri);
      await this._qroducer?.send({
        data: Buffer.from(new QueryBuf(query).buffer),
        properties: { uri },
      });
    }
    return new StreamableFile(new QueryPathBuf({ uri }).buffer);
  }

  /**
   * Returns a stream that is passes the results of the query
   * that was posted under the specified `uri`.
   */
  public async streamResults(uri: string): Promise<StreamableFile> {
    const read = async (stream: PassThrough) => {
      const exist = await this.assertTopic(uri);
      if (!exist) {
        stream.destroy(
          new HttpException(
            `Topic does not exists: ${uri}`,
            HttpStatus.FAILED_DEPENDENCY,
          ),
        );
      } else {
        const reader = await this._client.createReader({
          topic: uri,
          readerName: uri,
          startMessageId: MessageId.earliest(),
        });
        let message = await reader.readNext();
        let state = message.getProperties().state;
        while (
          message &&
          state &&
          state !== QueryState.DONE.toString() &&
          state !== QueryState.FAIL.toString()
        ) {
          if (
            state === QueryState.SCHEMA.toString() ||
            state === QueryState.CHUNK.toString()
          ) {
            stream.write(message.getData());
          }
          message = await reader.readNext();
          state = message.getProperties().state;
        }
        if (state === QueryState.FAIL.toString()) {
          stream.destroy(
            new HttpException(
              message.getProperties().error,
              HttpStatus.FAILED_DEPENDENCY,
            ),
          );
        } else {
          stream.end();
        }
        await reader.close();
      }
    };
    const stream = new PassThrough();
    read(stream).catch((reason) => {
      throw reason;
    });
    return Promise.resolve(new StreamableFile(stream));
  }

  /**
   * Ensures the existence of the `topic`.
   */
  protected async ensureTopic(topic: string): Promise<boolean> {
    const exist = await this.assertTopic(topic);
    if (!exist) {
      return await this.createTopic(topic);
    }
    return true;
  }

  /**
   * Determines whether the specified `topic` if exists, or not.
   */
  private async assertTopic(topic: string): Promise<boolean> {
    const uri = `${this._uri}/${topic}/internalStats`;
    const response = await fetch(uri, {
      method: "GET",
      cache: "no-cache",
    });
    if (!response.ok) {
      this._logger.error(
        `${response.status} - ${response.statusText}`,
      );
      return false;
    }
    return true;
  }

  /**
   * Creates the specified persistent non-partitioned `topic`. Returns
   * `true` if the topic was successfuly created, false otherwise.
   */
  private async createTopic(topic: string): Promise<boolean> {
    const uri = `${this._uri}/${topic}`;
    const response = await fetch(uri, {
      method: "PUT",
      cache: "no-cache",
    });
    if (!response.ok) {
      this._logger.error(
        `${response.status} - ${response.statusText}`,
      );
      return false;
    }
    return true;
  }

  /**
   * Deletes the specified persistent non-partitioned `topic`. Returns
   * true if the topic was successfuly deleted, false otherwise.
   */
  private async deleteDelete(topic: string): Promise<boolean> {
    const uri = `${this._uri}/${topic}`;
    const response = await fetch(uri, {
      method: "DELETE",
      cache: "no-cache",
    });
    if (!response.ok) {
      this._logger.error(
        `${response.status} - ${response.statusText}`,
      );
      return false;
    }
    return true;
  }

  /**
   * Returns the array of the existing topics.
   */
  private async listTopics(): Promise<string[]> {
    const uri = `${this._uri}/topics?mode=PERSISTENT`;
    const response = await fetch(uri, {
      method: "GET",
      cache: "no-cache",
    });
    if (!response.ok) {
      this._logger.error(
        `${response.status} - ${response.statusText}`,
      );
      return [];
    }
    const topics = <string[]>await response.json();
    return topics;
  }

  /**
   * Queries consumer inbound messages event listener.
   */
  private qonsumerListener(
    message: Message,
    qonsumer: Consumer,
  ): void {
    this.inboundQueryHandler(message, qonsumer).catch(
      this._logger.error,
    );
  }

  /**
   * Inbound query message handler.
   */
  private async inboundQueryHandler(
    message: Message,
    qonsumer: Consumer,
  ): Promise<void> {
    const uri = message.getProperties().uri;
    const exist = await this.assertTopic(uri);
    if (!exist) {
      this._logger.error(`Topic does not exists: ${uri}`);
      await qonsumer.acknowledge(message);
    } else {
      const producer = await this._client.createProducer({
        topic: uri,
      });
      const dataset = new Dataset(new QueryBuf(message.getData()), {
        host: this._conf.querierHost,
        port: this._conf.querierPort,
      });
      for await (const batch of dataset) {
        const properties: Record<string, string> = {
          state: JSON.stringify(batch.state),
        };
        if (batch.error) {
          properties.error = batch.error;
        }
        await producer.send({
          data: Buffer.from(batch.data ? batch.data : ""),
          properties,
        });
      }
      await producer.close();
      await qonsumer.acknowledge(message);
    }
  }
}

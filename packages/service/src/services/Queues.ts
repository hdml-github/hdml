/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

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
  Reader,
  MessageId,
  Message,
  LogLevel,
} from "pulsar-client";
import { Config } from "./Config";
import { Logger } from "./Logger";
import { Threads } from "./Threads";

/**
 * Queries queues service class.
 */
@Injectable()
export class Queues {
  private _uri: string;
  private _logger: Logger;
  private _client: Client;
  private _consumer: null | Consumer = null;
  private _producer: null | Producer = null;

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
    const exist = await this.assertTopic(this._conf.queueQueries);
    if (!exist) {
      await this.createTopic(this._conf.queueQueries);
    }
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
}

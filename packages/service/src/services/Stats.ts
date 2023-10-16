/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { StatsD } from "hot-shots";
import { Config } from "./Config";
import { Logger } from "./Logger";
import { Thread } from "./Thread";

/**
 * Statistics service.
 */
@Injectable()
export class Stats implements OnApplicationShutdown {
  private _logger: Logger;
  private _client: null | StatsD = null;

  /**
   * @constructor
   */
  public constructor(private _conf: Config, private _thread: Thread) {
    this._client = new StatsD({
      host: this._conf.statsHost,
      port: this._conf.statsPort,
      cacheDns: true,
      mock: this._conf.statsMock,
      telegraf: false,
      prefix: "hdml.io://",
      globalTags: ["hdml.io"],
    });
    this._logger = new Logger("Stats", this._thread);
    this.dispatch("stats::constructed");
  }

  /**
   * @implements
   */
  public onApplicationShutdown(): void {
    if (this._client) {
      const client = this._client;
      client.close((err?: Error) => {
        this._client = null;
        if (err) {
          this._logger.error("Error closing statistics client.", err);
        }
      });
    }
  }

  /**
   * Sends a workflow's continuation to the statistics server.
   */
  public continuation(workflow: string, timing: number): void {
    this._client && this._client.timing(workflow, timing);
  }

  /**
   * Sends the variable increment to the statistics server.
   */
  public increment(variable: string): void {
    this._client && this._client.increment(variable);
  }

  /**
   * Sends the variable decrement to the statistics server.
   */
  public decrement(variable: string): void {
    this._client && this._client.decrement(variable);
  }

  /**
   * Sends an `event` to the statistics server.
   */
  public dispatch(event: string): void {
    this._client && this._client.event(event);
  }
}

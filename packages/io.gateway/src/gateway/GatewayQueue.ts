import { Injectable, OnModuleInit } from "@nestjs/common";
import { BaseLogger, BaseOptions, BaseQueue } from "@hdml/io.common";
import { OptionsService } from "../options/OptionsService";

/**
 * Gateway queue service class.
 */
@Injectable()
export class GatewayQueue extends BaseQueue implements OnModuleInit {
  /**
   * Service logger.
   */
  private readonly _logger = new BaseLogger(GatewayQueue.name, {
    timestamp: true,
  });

  /**
   * Class constructor.
   */
  public constructor(private readonly _options: OptionsService) {
    super();
  }

  /**
   * @override
   */
  protected logger(): BaseLogger {
    return this._logger;
  }

  /**
   * @override
   */
  protected options(): BaseOptions {
    return this._options;
  }

  /**
   * Module initialized callback.
   */
  public onModuleInit(): void {
    this._logger.log("Running IO");
    this.runWorkflow().catch((reason) => {
      this._logger.error(reason);
    });
  }

  /**
   * Runs async workflow.
   */
  private async runWorkflow(): Promise<void> {
    await this.ensureQueries();
    await this.queriesProducer();
  }

  public async test(): Promise<string> {
    const topic =
      `${this.getHashname("sql query")}.` +
      `${this.getTimehash(Date.now())}`;
    const status = await this.stats("topic hash");
    return JSON.stringify(status, undefined, 2);
  }
}

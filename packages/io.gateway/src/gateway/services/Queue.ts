import { Injectable, OnModuleInit } from "@nestjs/common";
import { Document } from "@hdml/schema";
import { getSQL } from "@hdml/orchestrator";
import { BaseLogger, BaseOptions, BaseQueue } from "@hdml/io.common";
import { Options } from "./Options";

/**
 * Gateway queue service class.
 */
@Injectable()
export class Queue extends BaseQueue implements OnModuleInit {
  /**
   * Service logger.
   */
  private readonly _logger = new BaseLogger(Queue.name, {
    timestamp: true,
  });

  /**
   * Class constructor.
   */
  public constructor(private readonly _options: Options) {
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
    this.logger().log("Running gateway queue service");
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

  /**
   * @throws
   */
  public async postHdmlDocument(hdml: Document): Promise<string> {
    const sql = getSQL(hdml);
    const hashname = this.getHashname(sql);
    const hashtime = this.getHashtime(Date.now());
    const name = `${hashname}.${hashtime}`;
    const stats = await this.stats(name);
    if (!stats) {
      await this.create(name);
      const writer = await this.queriesProducer();
      await writer.send({
        data: Buffer.from(hdml.buffer),
        properties: { name },
      });
    }
    return name;
  }
}

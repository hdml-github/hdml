import { Injectable, OnModuleInit } from "@nestjs/common";
import { Document } from "@hdml/schema";
import {
  BaseLogger,
  BaseOptions,
  BaseQueue,
  Message,
  Consumer,
} from "@hdml/io.common";
import { Options } from "./Options";
import { TrinoDataset } from "../../executor/TrinoDataset";

/**
 * Gateway queue service class.
 */
@Injectable()
export class QuerierQueue extends BaseQueue implements OnModuleInit {
  /**
   * Service logger.
   */
  private readonly _logger = new BaseLogger(QuerierQueue.name, {
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
    this.logger().log("Running querier queue service");
    this.runWorkflow().catch((reason) => {
      this.logger().error(reason);
    });
  }

  /**
   * Runs async workflow.
   */
  private async runWorkflow(): Promise<void> {
    await this.ensureQueries();
    await this.queriesConsumer(
      (message: Message, consumer: Consumer) => {
        this.queryHandler(message, consumer).catch(
          this.logger().error,
        );
      },
    );
  }

  private async queryHandler(
    message: Message,
    consumer: Consumer,
  ): Promise<void> {
    const name = message.getProperties().name;
    const stats = await this.stats(name);
    if (stats) {
      const producer = await this.dataProducer(name);
      const dataset = new TrinoDataset(
        new Document(message.getData()),
        this._options,
      );
      for await (const batch of dataset) {
        console.log(batch);
        await producer.send({
          data: Buffer.from(batch.data ? batch.data : ""),
          properties: { state: batch.state },
        });
      }
      await producer.close();
      await consumer.acknowledge(message);
    }
  }
}

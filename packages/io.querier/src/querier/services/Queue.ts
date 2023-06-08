/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Injectable, OnModuleInit } from "@nestjs/common";
import { Query } from "@hdml/schema";
import {
  BaseLogger,
  BaseOptions,
  BaseQueue,
  Message,
  Consumer,
} from "@hdml/io.common";
import { Options } from "./Options";
import { SqlEngineDataset } from "../../executor/SqlEngineDataset";

/**
 * Gateway queue service class.
 */
@Injectable()
export class Queue extends BaseQueue implements OnModuleInit {
  /**
   * Service logger.
   */
  private readonly _logger = new BaseLogger("Queue(querier)", {
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
   * Runs async initialization workflow.
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

  /**
   * Handles an incoming request message and processes it.
   */
  private async queryHandler(
    message: Message,
    consumer: Consumer,
  ): Promise<void> {
    const name = message.getProperties().name;
    const stats = await this.stats(name);
    if (stats) {
      const producer = await this.dataProducer(name);
      const dataset = new SqlEngineDataset(
        new Query(message.getData()),
        this._options,
      );
      for await (const batch of dataset) {
        const properties: { [key: string]: string } = {
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
      await consumer.acknowledge(message);
    } else {
      // TODO (buntarb): ???
    }
  }
}

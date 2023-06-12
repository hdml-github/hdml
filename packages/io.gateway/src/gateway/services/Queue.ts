/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { PassThrough } from "stream";
import {
  Injectable,
  OnModuleInit,
  StreamableFile,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Query, File, FileState } from "@hdml/schema";
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
  private readonly _logger = new BaseLogger("Queue(gateway)", {
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
   * Sends the specified `query` to the queue and returns the name of
   * the result `hdml` file.
   */
  public async postQuery(query: Query): Promise<StreamableFile> {
    const sql = getSQL(query);
    const hash = this.getHashname(sql);
    const time = this.getHashtime(Date.now());
    const name = `${hash}.${time}.hdml`;
    const stats = await this.stats(name);
    if (!stats) {
      await this.create(name);
      const writer = await this.queriesProducer();
      await writer.send({
        data: Buffer.from(query.buffer),
        properties: { name },
      });
    }
    return new StreamableFile(new File({ name }).buffer);
  }

  /**
   * Returns the result `file` stream.
   */
  public async getResultFileStream(
    file: string,
  ): Promise<StreamableFile> {
    const read = async (stream: PassThrough) => {
      const reader = await this.dataReader(file);
      let message = await reader.readNext();
      let state = message.getProperties().state;
      while (
        message &&
        state &&
        state !== FileState.DONE.toString() &&
        state !== FileState.FAIL.toString()
      ) {
        if (
          state === FileState.SCHEMA.toString() ||
          state === FileState.CHUNK.toString()
        ) {
          stream.write(message.getData());
        }
        message = await reader.readNext();
        state = message.getProperties().state;
      }
      if (state === FileState.FAIL.toString()) {
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
    };
    const stream = new PassThrough();
    read(stream).catch((reason) => {
      this.logger().error(reason);
    });
    return Promise.resolve(new StreamableFile(stream));
  }
}

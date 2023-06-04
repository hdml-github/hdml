import { PassThrough } from "stream";
import {
  Injectable,
  OnModuleInit,
  StreamableFile,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Document, Name } from "@hdml/schema";
import { getSQL } from "@hdml/orchestrator";
import { BaseLogger, BaseOptions, BaseQueue } from "@hdml/io.common";
import { Options } from "./Options";

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
   * Posts specified `hdml` document to the queue and returns its
   * unique identifier.
   * @throws
   */
  public async postHdmlDocument(
    hdml: Document,
  ): Promise<StreamableFile> {
    const sql = getSQL(hdml);
    const hash = this.getHashname(sql);
    const time = this.getHashtime(Date.now());
    const name = `${hash}.${time}.hdml`;
    const stats = await this.stats(name);
    if (!stats) {
      await this.create(name);
      const writer = await this.queriesProducer();
      await writer.send({
        data: Buffer.from(hdml.buffer),
        properties: { name },
      });
    }
    return new StreamableFile(new Name(name).buffer);
  }

  /**
   * Returns document's `file` stream.
   */
  public async getHdmlDocumentFile(
    file: string,
  ): Promise<StreamableFile> {
    // This function is a workaround required to avoid uses of the
    // reader callback that is cause "segmentation fault (core
    // dumped)" error.
    const read = async (stream: PassThrough) => {
      const reader = await this.dataReader(file, stream);
      let message = await reader.readNext();
      let state = message.getProperties().state;
      while (
        message &&
        state &&
        state !== "DONE" &&
        state !== "FAIL"
      ) {
        if (state === "SCHEMA" || state === "CHUNK") {
          stream.write(message.getData());
        }
        message = await reader.readNext();
        state = message.getProperties().state;
      }
      if (state === "FAIL") {
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

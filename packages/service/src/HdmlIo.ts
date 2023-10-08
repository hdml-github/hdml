#! /usr/bin/env node

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  Module,
  Logger,
  ValidationPipe,
  UnprocessableEntityException,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { TerminusModule } from "@nestjs/terminus";
import { program } from "commander";
import { Config } from "./services/Config";

/**
 * CLI options.
 */
type CliOpts = {
  /**
   * Path to the `.env` file.
   */
  envpath: string;
};

// CLI configuration.
program.option("--envpath <envpath>");
program.parse();

/**
 * `hdml.io` micro-service module.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [program.opts<CliOpts>().envpath || ".env"],
      ignoreEnvFile: false,
      isGlobal: true,
      cache: true,
      load: [
        Config.Gateway,
        Config.Hideway,
        Config.Querier,
        Config.Engine,
        Config.Queue,
        Config.FileStruct,
        Config.JWE,
      ],
    }),
    TerminusModule,
  ],
  providers: [Config],
  controllers: [],
})
export class HdmlIo {
  /**
   * @constructor
   */
  public constructor(private _conf: Config) {
    console.log(this._conf);
  }
}

/**
 * Self calling function to bootstrap service.
 */
(async () => {
  const logger = new Logger("root", {
    timestamp: true,
  });
  const app = await NestFactory.create<NestFastifyApplication>(
    HdmlIo,
    new FastifyAdapter(),
  );
  app.enableCors();
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        logger.warn(JSON.stringify(errors));
        return new UnprocessableEntityException(errors);
      },
    }),
  );
  process.on("unhandledRejection", (reason, promise) => {
    logger.fatal(
      "UNHANDLED_REJECTION",
      {
        promise,
        reason,
      },
      reason as Error,
    );
  });
  process.on("uncaughtException", (reason, promise) => {
    logger.fatal(
      "UNKAUGHT_EXCEPTION",
      {
        promise,
        reason,
      },
      reason,
    );
  });
})().catch(console.error);

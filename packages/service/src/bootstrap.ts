#! /usr/bin/env node

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  Logger,
  ValidationPipe,
  UnprocessableEntityException,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { getModuleHost, getModulePort } from "./helpers/getModule";
import { Config } from "./services/Config";
import { IoModule } from "./IoModule";

/**
 * Self calling function to bootstrap service.
 */
(async () => {
  const logger = new Logger("Bootstrapper");
  logger.log("Starting service...");

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

  const app = await NestFactory.create<NestFastifyApplication>(
    IoModule,
    new FastifyAdapter(),
  );
  const config = app.get(Config);
  // TODO: add CORS configuration.
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
  await app.listen(getModulePort(config), getModuleHost(config));

  logger.log(
    `Listening ${getModuleHost(config)}:${getModulePort(config)}`,
  );
})().catch(console.error);

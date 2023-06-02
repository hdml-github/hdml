#! /usr/bin/env node

import { NestFactory } from "@nestjs/core";
import { Querier } from ".";

async function bootstrap() {
  const app = await NestFactory.create(Querier, {
    abortOnError: false,
  });
  await app.listen(Querier.port());
}

bootstrap().catch((reason) => {
  console.error(reason);
});

#! /usr/bin/env node

import { NestFactory } from "@nestjs/core";
import { Hideway } from ".";

async function bootstrap() {
  const hideway = await NestFactory.create(Hideway, {
    abortOnError: false,
    cors: true,
  });
  await hideway.listen(Hideway.port());
}

bootstrap().catch((reason) => {
  console.error(reason);
});

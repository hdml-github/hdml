#! /usr/bin/env node

import { NestFactory } from "@nestjs/core";
import { Gateway } from ".";

async function bootstrap() {
  const gateway = await NestFactory.create(Gateway, {
    abortOnError: false,
    cors: true,
  });
  await gateway.listen(Gateway.port());
}

bootstrap().catch((reason) => {
  console.error(reason);
});

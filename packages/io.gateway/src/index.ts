#! /usr/bin/env node

import { NestFactory } from "@nestjs/core";
import { Gateway } from "./gateway/Gateway";

async function bootstrap() {
  const app = await NestFactory.create(Gateway, {
    abortOnError: false,
    cors: true,
  });
  await app.listen(Gateway.port());
}

bootstrap().catch((reason) => {
  console.error(reason);
});

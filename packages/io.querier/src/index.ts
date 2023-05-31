#! /usr/bin/env node

import { NestFactory } from "@nestjs/core";
import { QueryModule } from "./query/QueryModule";

async function bootstrap() {
  const app = await NestFactory.create(QueryModule, {
    abortOnError: false,
  });
  await app.listen(3000);
}

bootstrap().catch((reason) => {
  console.error(reason);
});

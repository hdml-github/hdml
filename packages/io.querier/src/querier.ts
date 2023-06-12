#! /usr/bin/env node

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { NestFactory } from "@nestjs/core";
import { Querier } from ".";

(async () => {
  const app = await NestFactory.create(Querier, {
    abortOnError: false,
  });
  await app.listen(Querier.port());
})().catch((reason) => {
  console.error(reason);
});

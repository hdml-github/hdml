#! /usr/bin/env node

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { NestFactory } from "@nestjs/core";
import { Gateway } from ".";
(async () => {
  const gateway = await NestFactory.create(Gateway, {
    abortOnError: false,
    cors: true,
  });
  await gateway.listen(Gateway.port());
})().catch((reason) => {
  console.error(reason);
});

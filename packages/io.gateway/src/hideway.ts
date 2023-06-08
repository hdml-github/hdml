#! /usr/bin/env node

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { NestFactory } from "@nestjs/core";
import { Hideway } from ".";
(async () => {
  const hideway = await NestFactory.create(Hideway, {
    abortOnError: false,
    cors: true,
  });
  await hideway.listen(Hideway.port());
})().catch((reason) => {
  console.error(reason);
});

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Module, MiddlewareConsumer } from "@nestjs/common";
import { getModuleMetadata } from "./helpers/getModOpts";
import { HttpThread } from "./middlewares/HttpThread";
import { Config } from "./services/Config";

/**
 * `IO` service module configuration.
 */
@Module(getModuleMetadata())
export class IoModule {
  /**
   * @constructor
   */
  public constructor(private _conf: Config) {}

  /**
   * @override
   */
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpThread).forRoutes("*");
  }
}

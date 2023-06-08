/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Module } from "@nestjs/common";
import { Options } from "./services/Options";
import { Queue } from "./services/Queue";

/**
 * NestJS `Querier` module class.
 */
@Module({
  imports: [],
  exports: [],
  controllers: [],
  providers: [Options, Queue],
})
export class Querier {
  private static _options: null | Options = null;

  /**
   * The port of the `Querier` service.
   */
  public static port(): number {
    return Querier._options?.getQuerierPort() || 8886;
  }

  /**
   * Class constructor.
   */
  constructor(options: Options) {
    Querier._options = options;
  }
}

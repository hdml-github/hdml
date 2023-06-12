/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Module } from "@nestjs/common";
import { Options } from "./services/Options";
import { Tenants } from "./services/Tenants";
import { Queue } from "./services/Queue";
import { Tokens } from "./services/Tokens";
import { Compiler } from "./services/Compiler";
import { PrivateREST } from "./controllers/PrivateREST.v0";

/**
 * NestJS `Hideway` module class.
 */
@Module({
  imports: [],
  controllers: [PrivateREST],
  providers: [Options, Tokens, Compiler, Tenants, Queue],
})
export class Hideway {
  private static _options: null | Options = null;

  /**
   * The port of the `Hideway` service.
   */
  public static port(): number {
    return Hideway._options?.getHidewayPort() || 8888;
  }

  /**
   * Class constructor.
   */
  constructor(options: Options) {
    Hideway._options = options;
  }
}

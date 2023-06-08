import { Module } from "@nestjs/common";
import { Options } from "./services/Options";
import { Tenants } from "./services/Tenants";
import { Queries } from "./services/Queries";
import { Queue } from "./services/Queue";
import { Tokens } from "./services/Tokens";
import { Compiler } from "./services/Compiler";
import { PublicREST } from "./controllers/PublicREST.v0";

/**
 * NestJS `Gateway` module class.
 */
@Module({
  imports: [],
  exports: [],
  controllers: [PublicREST],
  providers: [Options, Tokens, Compiler, Tenants, Queries, Queue],
})
export class Gateway {
  private static _options: null | Options = null;

  /**
   * The port of the `Gateway` service.
   */
  public static port(): number {
    return Gateway._options?.getGatewayPort() || 8888;
  }

  /**
   * Class constructor.
   */
  constructor(options: Options) {
    Gateway._options = options;
  }
}

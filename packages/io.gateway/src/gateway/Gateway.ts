import { Module } from "@nestjs/common";
import { Options } from "./services/Options";
import { Filer } from "./services/Filer";
import { Queue } from "./services/Queue";
import { Tokens } from "./services/Tokens";
import { Compiler } from "./services/Compiler";
import { PublicREST } from "./controllers/PublicREST.v0";

@Module({
  imports: [],
  exports: [],
  controllers: [PublicREST],
  providers: [Options, Tokens, Compiler, Filer, Queue],
})
export class Gateway {
  private static _options: null | Options = null;

  public static port(): number {
    return Gateway._options?.getGatewayPort() || 8888;
  }

  constructor(options: Options) {
    Gateway._options = options;
  }
}

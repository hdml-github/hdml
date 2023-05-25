import { Module } from "@nestjs/common";
import { Options } from "./services/Options";
import { Filer } from "./services/Filer";
import { Tokens } from "./services/Tokens";
import { Compiler } from "./services/Compiler";
import { PrivateREST } from "./controllers/PrivateREST.v0";

@Module({
  imports: [],
  controllers: [PrivateREST],
  providers: [Options, Tokens, Compiler, Filer],
})
export class Hideway {
  private static _options: null | Options = null;

  public static port(): number {
    return Hideway._options?.getHidewayPort() || 8888;
  }

  constructor(options: Options) {
    Hideway._options = options;
  }
}

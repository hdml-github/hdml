import { Module } from "@nestjs/common";
import { Options } from "./services/Options";
import { QuerierQueue } from "./services/QuerierQueue";

@Module({
  imports: [],
  exports: [],
  controllers: [],
  providers: [Options, QuerierQueue],
})
export class Querier {
  private static _options: null | Options = null;

  public static port(): number {
    return Querier._options?.getQuerierPort() || 8886;
  }

  constructor(options: Options) {
    Querier._options = options;
  }
}

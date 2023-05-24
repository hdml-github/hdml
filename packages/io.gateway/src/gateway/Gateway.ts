import { Module } from "@nestjs/common";
import { Options } from "../options/Options";
import { OptionsSvc } from "../options/OptionsSvc";
import { Filer } from "../filer/Filer";
import { QueueSvc } from "./QueueSvc";
import { PublicRestCtrl } from "./PublicRestCtrl";

@Module({
  imports: [Options, Filer],
  controllers: [PublicRestCtrl],
  providers: [QueueSvc],
})
export class Gateway {
  private static _options: null | OptionsSvc = null;

  public static port(): number {
    return Gateway._options?.getGatewayPort() || 8888;
  }

  constructor(options: OptionsSvc) {
    Gateway._options = options;
  }
}

import { Module } from "@nestjs/common";
import { OptionsModule } from "../options/OptionsModule";
import { OptionsService } from "../options/OptionsService";
import { FilerModule } from "../filer/FilerModule";
import { GatewayQueue } from "./GatewayQueue";
import { GatewayRestApiV0 } from "./GatewayRestApiV0";

@Module({
  imports: [OptionsModule, FilerModule],
  controllers: [GatewayRestApiV0],
  providers: [GatewayQueue],
})
export class Gateway {
  private static _options: null | OptionsService = null;

  public static port(): number {
    return Gateway._options?.getGatewayPort() || 8888;
  }

  constructor(options: OptionsService) {
    Gateway._options = options;
  }
}

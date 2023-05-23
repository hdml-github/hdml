import { Module } from "@nestjs/common";
import { OptionsModule } from "../options/OptionsModule";
import { FilerModule } from "../filer/FilerModule";
import { IoController } from "./IoController";
import { IoService } from "./IoService";

@Module({
  imports: [OptionsModule, FilerModule],
  controllers: [IoController],
  providers: [IoService],
})
export class IoModule {}

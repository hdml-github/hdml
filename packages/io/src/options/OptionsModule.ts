import { Module } from "@nestjs/common";
import { OptionsService } from "./OptionsService";

@Module({
  controllers: [],
  providers: [OptionsService],
  exports: [OptionsService],
})
export class OptionsModule {}

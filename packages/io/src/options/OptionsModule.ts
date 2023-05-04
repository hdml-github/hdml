import { Module } from "@nestjs/common";
import { OptionsService } from "./OptionsService";

@Module({
  imports: [],
  exports: [OptionsService],
  providers: [OptionsService],
  controllers: [],
})
export class OptionsModule {}

import { Module } from "@nestjs/common";
import { OptionsSvc } from "./OptionsSvc";

@Module({
  imports: [],
  exports: [OptionsSvc],
  providers: [OptionsSvc],
  controllers: [],
})
export class Options {}

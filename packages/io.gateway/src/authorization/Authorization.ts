import { Module } from "@nestjs/common";
import { Options } from "../options/Options";
import { TokensSvc } from "./TokensSvc";

@Module({
  imports: [Options],
  exports: [TokensSvc],
  providers: [TokensSvc],
  controllers: [],
})
export class Authorization {}

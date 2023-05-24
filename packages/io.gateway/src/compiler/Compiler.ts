import { Module } from "@nestjs/common";
import { Options } from "../options/Options";
import { CompilerSvc } from "./CompilerSvc";

@Module({
  imports: [Options],
  exports: [CompilerSvc],
  providers: [CompilerSvc],
  controllers: [],
})
export class Compiler {}

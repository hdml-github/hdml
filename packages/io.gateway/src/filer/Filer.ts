import { Module } from "@nestjs/common";
import { Options } from "../options/Options";
import { Authorization } from "../authorization/Authorization";
import { Compiler } from "../compiler/Compiler";
import { FilerSvc } from "./FilerSvc";

@Module({
  imports: [Options, Authorization, Compiler],
  exports: [FilerSvc],
  providers: [FilerSvc],
  controllers: [],
})
export class Filer {}

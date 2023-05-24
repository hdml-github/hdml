import { Module } from "@nestjs/common";
import { OptionsModule } from "../options/OptionsModule";
import { CompilerModule } from "../compiler/CompilerModule";
import { FilerService } from "./FilerService";

@Module({
  imports: [OptionsModule, CompilerModule],
  exports: [FilerService],
  providers: [FilerService],
  controllers: [],
})
export class FilerModule {}

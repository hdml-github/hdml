import { Module } from "@nestjs/common";
import { OptionsModule } from "../options/OptionsModule";
import { CompilerService } from "./CompilerService";

@Module({
  imports: [OptionsModule],
  exports: [CompilerService],
  providers: [CompilerService],
  controllers: [],
})
export class CompilerModule {}

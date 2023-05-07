import { Module } from "@nestjs/common";
import { CompilerService } from "./CompilerService";

@Module({
  imports: [],
  exports: [CompilerService],
  providers: [CompilerService],
  controllers: [],
})
export class CompilerModule {}

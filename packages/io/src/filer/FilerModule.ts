import { Module } from "@nestjs/common";
import { OptionsModule } from "../options/OptionsModule";
import { FilerService } from "./FilerService";

@Module({
  imports: [OptionsModule],
  exports: [FilerService],
  providers: [FilerService],
})
export class FilerModule {}

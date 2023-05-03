import { Injectable, OnModuleInit } from "@nestjs/common";
import { OptionsService } from "../options/OptionsService";

@Injectable()
export class FilerService implements OnModuleInit {
  constructor(private readonly options: OptionsService) {}

  public onModuleInit(): void {
    // console.log("Filer", this.options.getProjectPath());
  }
}

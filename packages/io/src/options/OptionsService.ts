import { Injectable, OnModuleInit } from "@nestjs/common";
import { program } from "commander";

type Options = {
  project: string;
};

@Injectable()
export class OptionsService implements OnModuleInit {
  private options: null | Options = null;

  public onModuleInit(): void {
    program.option("--project <project>");
    program.parse();
    this.options = program.opts() as unknown as Options;
  }

  public getProjectPath(): string {
    return this.options?.project || ".";
  }
}

import { Injectable, OnModuleInit } from "@nestjs/common";
import { BaseOptions } from "@hdml/io.common";
import { program } from "commander";

type CliOptions = {
  project: string;
};

/**
 * Options service.
 */
@Injectable()
export class Options extends BaseOptions implements OnModuleInit {
  private _cliOptions: null | CliOptions = null;

  public onModuleInit(): void {
    program.option("--project <project>");
    program.parse();
    this._cliOptions = program.opts() as unknown as CliOptions;
  }

  /**
   * Returns project directory path.
   */
  public getProjectPath(): string {
    return this._cliOptions?.project || ".";
  }
}

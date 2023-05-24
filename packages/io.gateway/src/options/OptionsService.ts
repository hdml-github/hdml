import { Injectable, OnModuleInit } from "@nestjs/common";
import { BaseOptions } from "@hdml/io.common";
import { program } from "commander";

type Options = {
  project: string;
};

/**
 * Options service.
 */
@Injectable()
export class OptionsService
  extends BaseOptions
  implements OnModuleInit
{
  private _options: null | Options = null;

  public onModuleInit(): void {
    program.option("--project <project>");
    program.parse();
    this._options = program.opts() as unknown as Options;
  }

  /**
   * Returns project directory path.
   */
  public getProjectPath(): string {
    return this._options?.project || ".";
  }
}

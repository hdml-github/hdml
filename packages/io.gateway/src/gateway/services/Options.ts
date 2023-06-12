/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Injectable, OnModuleInit } from "@nestjs/common";
import { BaseOptions } from "@hdml/io.common";
import { program } from "commander";

/**
 * The `CLI` options type.
 */
type CliOptions = {
  project: string;
};

/**
 * Options of the `Gateway` (`Hideway`) service.
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
   * Returns the path to the project root directory.
   */
  public getProjectPath(): string {
    return this._cliOptions?.project || ".";
  }
}

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Controller, Get } from "@nestjs/common";
import { Compiler } from "../../../services/Compiler";

/**
 * The `api/v0/tests` endpoint controller.
 */
@Controller({ path: "api/v0/tests" })
export class tests {
  /**
   * Class constructor.
   */
  constructor(private _compiler: Compiler) {}

  @Get()
  run(): Promise<void> {
    return this._compiler.test();
  }
}

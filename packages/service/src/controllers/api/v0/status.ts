/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
} from "@nestjs/terminus";
import { Status } from "../../../services/Status";

/**
 * The `api/v0/status` endpoint controller.
 */
@Controller({ path: "api/v0/status" })
export class status {
  /**
   * Class constructor.
   */
  constructor(
    private _checker: HealthCheckService,
    private _status: Status,
  ) {}

  @Get()
  @HealthCheck()
  getStatus(): Promise<HealthCheckResult> {
    return this._checker.check([
      () => this._status.isQueueHealthy(),
      () => this._status.isQuerierHealthy(),
    ]);
  }
}

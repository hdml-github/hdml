/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Injectable } from "@nestjs/common";
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from "@nestjs/terminus";

/**
 * Status service.
 */
@Injectable()
export class Status extends HealthIndicator {
  constructor() {
    super();
  }

  /**
   * Determines whether the queue is healthy or not.
   */
  public async isQueueHealthy(): Promise<HealthIndicatorResult> {
    try {
      const isHealthy = await Promise.resolve(true);
      if (!isHealthy) {
        throw new HealthCheckError("Queue is not healthy", null);
      }
      return this.getStatus("queue", isHealthy);
    } catch (err) {
      throw new HealthCheckError("Queue assertion failed", err);
    }
  }

  /**
   * Determines whether the querier is healthy or not.
   */
  public async isQuerierHealthy(): Promise<HealthIndicatorResult> {
    try {
      const isHealthy = await Promise.resolve(true);
      if (!isHealthy) {
        throw new HealthCheckError("Querier is not healthy", null);
      }
      return this.getStatus("querier", isHealthy);
    } catch (err) {
      throw new HealthCheckError("Querier assertion failed", err);
    }
  }
}

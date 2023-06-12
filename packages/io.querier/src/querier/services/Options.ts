/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Injectable } from "@nestjs/common";
import { BaseOptions } from "@hdml/io.common";

/**
 * Options of the `Querier` service.
 */
@Injectable()
export class Options extends BaseOptions {
  /**
   * Returns the SQL engine host.
   */
  public getSqlEngineHost(): string {
    return "localhost";
  }

  /**
   * Returns the SQL engine port.
   */
  public getSqlEnginePort(): number {
    return 8080;
  }

  /**
   * Returns the SQL engine catalog.
   */
  public getSqlEngineCatalog(): undefined | string {
    return;
  }

  /**
   * Returns SQL engine schema.
   */
  public getSqlEngineSchema(): undefined | string {
    return;
  }
}

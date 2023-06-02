import { Injectable } from "@nestjs/common";
import { BaseOptions } from "@hdml/io.common";

/**
 * Options service.
 */
@Injectable()
export class Options extends BaseOptions {
  /**
   * Returns Trino host.
   */
  public getTrinoHost(): string {
    return "localhost";
  }

  /**
   * Returns Trino port.
   */
  public getTrinoPort(): number {
    return 8080;
  }

  /**
   * Returns Trino catalog to query from.
   */
  public getTrinoCatalog(): undefined | string {
    return;
  }

  /**
   * Returns Trino schema to query from.
   */
  public getTrinoSchema(): undefined | string {
    return;
  }
}

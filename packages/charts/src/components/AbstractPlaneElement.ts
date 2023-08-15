/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { AbstractChartElement } from "./AbstractChartElement";

export class AbstractPlaneElement extends AbstractChartElement {
  /**
   * @implements
   */
  protected get geometrySelector(): null | string {
    return null;
  }

  /**
   * @implements
   */
  protected renderGeometry(): void {
    //
  }

  /**
   * @implements
   */
  protected updateGeometry(): void {
    //
  }
}

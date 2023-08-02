/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { BaseChartElement } from "./BaseChartElement";
import { AbstractScaleElement } from "./AbstractScaleElement";

export class BaseAxisElement extends BaseChartElement {
  /**
   * Scale for `x` direction.
   */
  public get scaleX(): null | AbstractScaleElement {
    return this.getScale("x");
  }

  /**
   * Scale for `y` direction.
   */
  public get scaleY(): null | AbstractScaleElement {
    return this.getScale("y");
  }

  /**
   * Scale for `z` direction.
   */
  public get scaleZ(): null | AbstractScaleElement {
    return this.getScale("z");
  }

  /**
   * Scale for `i` direction.
   */
  public get scaleI(): null | AbstractScaleElement {
    return this.getScale("i");
  }

  /**
   * Scale for `j` direction.
   */
  public get scaleJ(): null | AbstractScaleElement {
    return this.getScale("j");
  }

  /**
   * Returns scale for the specified direction.
   */
  private getScale(
    direction: "x" | "y" | "z" | "i" | "j",
  ): null | AbstractScaleElement {
    let cnt = 0;
    let parent: null | HTMLElement | AbstractScaleElement =
      this.parentElement;
    while (parent && cnt <= 5) {
      if (
        parent instanceof AbstractScaleElement &&
        parent.direction === direction
      ) {
        return parent;
      } else {
        cnt++;
        parent = parent.parentElement;
      }
    }
    return null;
  }
}

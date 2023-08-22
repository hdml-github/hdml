/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { AbstractChartElement } from "./AbstractChartElement";
import { AbstractPlaneElement } from "./AbstractPlaneElement";

/**
 * Cartesian plane dimension enum.
 */
export enum Dimension {
  X = "x",
  Y = "y",
  Z = "z",
  I = "i",
  J = "j",
}

abstract class AbstractScaleElement extends AbstractChartElement {
  private _stylesheet: CSSStyleSheet = new CSSStyleSheet();

  /**
   * @implements
   */
  protected get geometrySelector(): null | string {
    return null;
  }

  /**
   * The plane associated with the scale.
   */
  public get plane(): null | AbstractPlaneElement {
    let cnt = 1;
    let parent: null | HTMLElement | AbstractPlaneElement =
      this.parentElement;
    while (parent && cnt <= 5) {
      if (parent instanceof AbstractPlaneElement) {
        return parent;
      } else {
        cnt++;
        parent = parent.parentElement;
      }
    }
    return null;
  }

  /**
   * Scale dimension.
   */
  public get dimension(): null | Dimension {
    let cnt = 1;
    let parent: null | HTMLElement | AbstractPlaneElement =
      this.parentElement;
    while (parent && cnt <= 5) {
      if (parent instanceof AbstractPlaneElement) {
        if (cnt === 1) {
          return Dimension.X;
        } else if (cnt === 2) {
          return Dimension.Y;
        } else if (cnt === 3) {
          return Dimension.Z;
        } else if (cnt === 4) {
          return Dimension.I;
        } else {
          return Dimension.J;
        }
      } else {
        cnt++;
        parent = parent.parentElement;
      }
    }
    return null;
  }

  /**
   * Scale range in pixels.
   */
  public get range(): [number, number] {
    const res: [number, number] = [0, 1];
    if (this.dimension === Dimension.X) {
      res[0] =
        (this.plane?.tracked.left || 0) +
        (this.plane?.tracked.paddingLeft || 0) +
        this.tracked.left;
      res[1] = res[0] + this.tracked.width;
    }
    if (this.dimension === Dimension.Y) {
      res[1] =
        (this.plane?.tracked.top || 0) +
        (this.plane?.tracked.paddingTop || 0) +
        this.tracked.top;
      res[0] = res[1] + this.tracked.height;
    }
    return res;
  }

  /**
   * @override
   */
  public render(): lit.TemplateResult<1> {
    return lit.html`
      <slot></slot>
    `;
  }

  /**
   * @override
   */
  protected updateStyles(): void {
    this._stylesheet.insertRule(`:host > slot {
      margin:
        -${this.tracked.paddingTop}px
        -${this.tracked.paddingRight}px
        -${this.tracked.paddingBottom}px
        -${this.tracked.paddingLeft}px;
    }`);
    super.updateStyles();
  }

  /**
   * @implements
   */
  protected renderGeometry(): void {
    this.resetStylesheets([this._stylesheet]);
  }

  /**
   * @implements
   */
  protected updateGeometry(): void {
    this.updateScale();
  }

  /**
   * Calculates scale parameters.
   */
  protected abstract updateScale(): void;
}

export { AbstractScaleElement };

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { BaseChartElement } from "./BaseChartElement";
import { BasePlaneElement } from "./BasePlaneElement";

export class BaseScaleElement extends BaseChartElement {
  /**
   * The plane associated with the scale.
   */
  public get plane(): null | BasePlaneElement {
    let cnt = 1;
    let parent: null | HTMLElement | BasePlaneElement =
      this.parentElement;
    while (parent && cnt <= 5) {
      if (parent instanceof BasePlaneElement) {
        return parent;
      } else {
        cnt++;
        parent = parent.parentElement;
      }
    }
    return null;
  }

  /**
   * Scale direction.
   */
  public get direction(): null | "x" | "y" | "z" | "i" | "j" {
    let cnt = 1;
    let parent: null | HTMLElement | BasePlaneElement =
      this.parentElement;
    while (parent && cnt <= 5) {
      if (parent instanceof BasePlaneElement) {
        if (cnt === 1) {
          return "x";
        } else if (cnt === 2) {
          return "y";
        } else if (cnt === 3) {
          return "z";
        } else if (cnt === 4) {
          return "i";
        } else {
          return "j";
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
    if (this.direction === "x") {
      res[0] =
        (this.plane?.tracked.left || 0) +
        (this.plane?.tracked.paddingLeft || 0) +
        this.tracked.left;
      res[1] = res[0] + this.tracked.width;
    }
    if (this.direction === "y") {
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
  protected firstUpdated(): void {
    this.patchShadowStyles();
  }

  /**
   * @override
   */
  public trackedStylesChanged(): void {
    this.patchShadowStyles();
  }

  private patchShadowStyles(): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const s = <{ styleSheet: CSSStyleSheet }>this.constructor.styles;
    const sheet = new CSSStyleSheet();
    sheet.insertRule(
      `:host > slot {
        margin:
          -${this.tracked.paddingTop}px
          -${this.tracked.paddingRight}px
          -${this.tracked.paddingBottom}px
          -${this.tracked.paddingLeft}px;
      }`,
    );
    lit.adoptStyles(<ShadowRoot>this.renderRoot, [
      s.styleSheet,
      sheet,
    ]);
  }
}

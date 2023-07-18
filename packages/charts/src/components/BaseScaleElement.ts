/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { BaseUnifiedElement } from "./BaseUnifiedElement";
import { BasePlaneElement } from "./BasePlaneElement";

export class BaseScaleElement extends BaseUnifiedElement {
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
        parent = this.parentElement;
      }
    }
    return null;
  }

  /**
   * Scale direction.
   */
  public get direction(): null | "x" | "y" | "z" {
    let cnt = 1;
    let parent: null | HTMLElement | BasePlaneElement =
      this.parentElement;
    while (parent && cnt <= 5) {
      if (parent instanceof BasePlaneElement) {
        if (cnt === 1) {
          return "x";
        } else if (cnt === 2) {
          return "y";
        } else {
          return "z";
        }
      } else {
        cnt++;
        parent = parent.parentElement;
      }
    }
    return null;
  }

  /**
   * @override
   */
  public get top(): number {
    if (!this.plane) {
      return super.top;
    } else {
      return super.top + this.plane.top + this.plane.paddingTop;
    }
  }

  /**
   * @override
   */
  public get right(): number {
    if (!this.plane) {
      return super.right;
    } else {
      return super.right + this.plane.right + this.plane.paddingRight;
    }
  }

  /**
   * @override
   */
  public get bottom(): number {
    if (!this.plane) {
      return super.bottom;
    } else {
      return (
        super.bottom + this.plane.bottom + this.plane.paddingBottom
      );
    }
  }

  /**
   * @override
   */
  public get left(): number {
    if (!this.plane) {
      return super.left;
    } else {
      return super.left + this.plane.left + this.plane.paddingLeft;
    }
  }

  /**
   * Element `margin-top` value in pixels.
   */
  public get marginTop(): number {
    if (this.direction === "x") {
      return 0;
    }
    if (this.direction === "y") {
      const parent = this.parentElement;
      if (
        parent &&
        parent instanceof BaseScaleElement &&
        parent.direction === "x"
      ) {
        return -parent.paddingTop;
      }
    }
    if (this.direction === "z") {
      const parent = this.parentElement;
      if (
        parent &&
        parent instanceof BaseScaleElement &&
        parent.direction === "y"
      ) {
        return -parent.paddingTop;
      }
    }
    return 0;
  }

  /**
   * Element `margin-right` value in pixels.
   */
  public get marginRight(): number {
    if (this.direction === "x") {
      return 0;
    }
    if (this.direction === "y") {
      const parent = this.parentElement;
      if (
        parent &&
        parent instanceof BaseScaleElement &&
        parent.direction === "x"
      ) {
        return -parent.paddingRight;
      }
    }
    if (this.direction === "z") {
      const parent = this.parentElement;
      if (
        parent &&
        parent instanceof BaseScaleElement &&
        parent.direction === "y"
      ) {
        return -parent.paddingRight;
      }
    }
    return 0;
  }

  /**
   * Element `margin-bottom` value in pixels.
   */
  public get marginBottom(): number {
    if (this.direction === "x") {
      return 0;
    }
    if (this.direction === "y") {
      const parent = this.parentElement;
      if (
        parent &&
        parent instanceof BaseScaleElement &&
        parent.direction === "x"
      ) {
        return -parent.paddingBottom;
      }
    }
    if (this.direction === "z") {
      const parent = this.parentElement;
      if (
        parent &&
        parent instanceof BaseScaleElement &&
        parent.direction === "y"
      ) {
        return -parent.paddingBottom;
      }
    }
    return 0;
  }

  /**
   * Element `margin-left` value in pixels.
   */
  public get marginLeft(): number {
    if (this.direction === "x") {
      return 0;
    }
    if (this.direction === "y") {
      const parent = this.parentElement;
      if (
        parent &&
        parent instanceof BaseScaleElement &&
        parent.direction === "x"
      ) {
        return -parent.paddingLeft;
      }
    }
    if (this.direction === "z") {
      const parent = this.parentElement;
      if (
        parent &&
        parent instanceof BaseScaleElement &&
        parent.direction === "y"
      ) {
        return -parent.paddingLeft;
      }
    }
    return 0;
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
  public firstUpdated(): void {
    this.style.marginTop = `${this.marginTop}px`;
    this.style.marginRight = `${this.marginRight}px`;
    this.style.marginBottom = `${this.marginBottom}px`;
    this.style.marginLeft = `${this.marginLeft}px`;
  }
}

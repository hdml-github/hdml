/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { UnifiedElement } from "@hdml/elements";

export class BaseUnifiedElement extends UnifiedElement {
  private _styles = window.getComputedStyle(this);

  /**
   * Component's computed styles.
   */
  public get styles(): CSSStyleDeclaration {
    return this._styles;
  }

  /**
   * Element `width` in pixels.
   */
  public get width(): number {
    return parseFloat(this.styles.width);
  }

  /**
   * Element `height` in pixels.
   */
  public get height(): number {
    return parseFloat(this.styles.height);
  }

  /**
   * Element `top` value in pixels.
   */
  public get top(): number {
    return parseFloat(this.styles.top);
  }

  /**
   * Element `right` value in pixels.
   */
  public get right(): number {
    return parseFloat(this.styles.right);
  }

  /**
   * Element `bottom` value in pixels.
   */
  public get bottom(): number {
    return parseFloat(this.styles.bottom);
  }

  /**
   * Element `left` value in pixels.
   */
  public get left(): number {
    return parseFloat(this.styles.left);
  }

  /**
   * Element `padding-top` value in pixels.
   */
  public get paddingTop(): number {
    return parseFloat(this.styles.paddingTop);
  }

  /**
   * Element `padding-right` value in pixels.
   */
  public get paddingRight(): number {
    return parseFloat(this.styles.paddingRight);
  }

  /**
   * Element `padding-bottom` value in pixels.
   */
  public get paddingBottom(): number {
    return parseFloat(this.styles.paddingBottom);
  }

  /**
   * Element `padding-left` value in pixels.
   */
  public get paddingLeft(): number {
    return parseFloat(this.styles.paddingLeft);
  }
}

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
   * Plane width in pixels.
   */
  public get width(): number {
    return parseFloat(this.styles.width);
  }

  /**
   * Plane height in pixels.
   */
  public get height(): number {
    return parseFloat(this.styles.height);
  }

  /**
   * Plane top value in pixels.
   */
  public get top(): number {
    return parseFloat(this.styles.top);
  }

  /**
   * Plane right value in pixels.
   */
  public get right(): number {
    return parseFloat(this.styles.right);
  }

  /**
   * Plane bottom value in pixels.
   */
  public get bottom(): number {
    return parseFloat(this.styles.bottom);
  }

  /**
   * Plane left value in pixels.
   */
  public get left(): number {
    return parseFloat(this.styles.left);
  }
}

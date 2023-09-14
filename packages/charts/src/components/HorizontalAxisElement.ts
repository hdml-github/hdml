/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { Dimension } from "./AbstractScaleElement";
import { DirectionType } from "./AbstractDirectionElement";
import { AbstractAxisElement } from "./AbstractAxisElement";

/**
 * Horizontal axis element.
 */
export class HorizontalAxisElement extends AbstractAxisElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
    :host {
      top: 100%;
      cursor: pointer;
      display: block !important;
      position: absolute !important;
      width: 100% !important;
      height: 0 !important;
      border: none !important;
      margin: 0 !important;
      padding: 0 !important;
    }
  `;

  /**
   * Reactive attributes.
   */
  public static properties = {
    /**
     * Private property to force updates.
     */
    _force: {
      type: Boolean,
      attribute: false,
      reflect: false,
      state: false,
    },

    /**
     * The `dimension` property definition.
     */
    dimension: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
      converter: {
        fromAttribute: (value: string): "x" | "z" | "i" | "j" => {
          if (!value) {
            return "x";
          } else {
            if (
              value === "x" ||
              value === "z" ||
              value === "i" ||
              value === "j"
            ) {
              return value;
            } else {
              return "x";
            }
          }
        },
        toAttribute: (value: string): string => {
          return value;
        },
      },
    },
  };

  private _dimension: Dimension = Dimension.X;

  /**
   * @override
   */
  public get type(): DirectionType {
    return DirectionType.Horizontal;
  }

  /**
   * @override
   */
  public set dimension(val: Dimension) {
    const attr = this.getAttribute("dimension");
    const sval = val;
    if (attr !== sval) {
      this.setAttribute("dimension", sval);
    }
    const old = this._dimension;
    this._dimension = val;
    this.requestUpdate("dimension", old);
  }

  /**
   * @override
   */
  public get dimension(): Dimension {
    return this._dimension;
  }
}
customElements.define("horizontal-axis", HorizontalAxisElement);

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { Dimension } from "./AbstractScaleElement";
import {
  DirectionType,
  HorizontalPosition,
} from "./AbstractDirection";
import { AbstractAxisElement } from "./AbstractAxisElement";

export class HorizontalAxisElement extends AbstractAxisElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
    :host {
      display: block;
      position: absolute;
      width: 100%;
      border: none;
      height: var(--hdml-line-width);
    }
    :host([position=top]) {
      top: calc(0% - var(--hdml-line-width)/2);
    }
    :host([position=center]) {
      top: calc(50% - var(--hdml-line-width)/2);
    }
    :host([position=bottom]) {
      top: calc(100% - var(--hdml-line-width)/2);
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

    /**
     * The `position` property definition.
     */
    position: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
      converter: {
        fromAttribute: (
          value: string,
        ): "bottom" | "center" | "top" => {
          if (!value) {
            return "bottom";
          } else {
            if (
              value === "bottom" ||
              value === "center" ||
              value === "top"
            ) {
              return value;
            } else {
              return "bottom";
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
  private _position: HorizontalPosition = HorizontalPosition.Bottom;

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

  /**
   * @override
   */
  public set position(val: HorizontalPosition) {
    const attr = this.getAttribute("position");
    const sval = val;
    if (attr !== sval) {
      this.setAttribute("position", sval);
    }
    const old = this._position;
    this._position = val;
    this.requestUpdate("position", old);
  }

  /**
   * @override
   */
  public get position(): HorizontalPosition {
    return this._position;
  }
}

customElements.define("horizontal-axis", HorizontalAxisElement);

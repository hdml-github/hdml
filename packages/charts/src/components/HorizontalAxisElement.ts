/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { AxisType, AbstractAxisElement } from "./AbstractAxisElement";

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
     * The `direction` property definition.
     */
    direction: {
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

  private _direction: "x" | "z" | "i" | "j" = "x";
  private _position: "bottom" | "center" | "top" = "bottom";

  /**
   * @override
   */
  public get type(): AxisType {
    return AxisType.Horizontal;
  }

  /**
   * @override
   */
  public set direction(val: "x" | "z" | "i" | "j") {
    const attr = this.getAttribute("direction");
    const sval = val;
    if (attr !== sval) {
      this.setAttribute("direction", sval);
    }
    const old = this._direction;
    this._direction = val;
    this.requestUpdate("direction", old);
  }

  /**
   * @override
   */
  public get direction(): "x" | "z" | "i" | "j" {
    return this._direction;
  }

  /**
   * @override
   */
  public set position(val: "bottom" | "center" | "top") {
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
  public get position(): "bottom" | "center" | "top" {
    return this._position;
  }
}

customElements.define("horizontal-axis", HorizontalAxisElement);

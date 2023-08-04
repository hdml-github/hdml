/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { AxisType, AbstractAxisElement } from "./AbstractAxisElement";

export class VerticalAxisElement extends AbstractAxisElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
    :host {
      display: block;
      position: absolute;
      box-sizing: border-box;
      width: 0;
      height: 100%;
      border: 1px solid black;
    }
    :host([position=left]) {
      left: 0;
    }
    :host([position=center]) {
      left: 50%;
    }
    :host([position=right]) {
      right: 0;
    }
  `;

  /**
   * Reactive attributes.
   */
  public static properties = {
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
        fromAttribute: (value: string): "y" | "z" | "i" | "j" => {
          if (!value) {
            return "y";
          } else {
            if (
              value === "y" ||
              value === "z" ||
              value === "i" ||
              value === "j"
            ) {
              return value;
            } else {
              return "y";
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
        ): "left" | "center" | "right" => {
          if (!value) {
            return "left";
          } else {
            if (
              value === "left" ||
              value === "center" ||
              value === "right"
            ) {
              return value;
            } else {
              return "left";
            }
          }
        },
        toAttribute: (value: string): string => {
          return value;
        },
      },
    },
  };

  private _direction: "y" | "z" | "i" | "j" = "y";
  private _position: "left" | "center" | "right" = "left";

  /**
   * @override
   */
  public get type(): AxisType {
    return AxisType.Vertical;
  }

  /**
   * @override
   */
  public set direction(val: "y" | "z" | "i" | "j") {
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
  public get direction(): "y" | "z" | "i" | "j" {
    return this._direction;
  }

  /**
   * @override
   */
  public set position(val: "left" | "center" | "right") {
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
  public get position(): "left" | "center" | "right" {
    return this._position;
  }
}

customElements.define("vertical-axis", VerticalAxisElement);

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
      height: 100%;
      border: none;
      width: var(--hdml-line-width);
    }
    :host([position=left]) {
      left: calc(0% - var(--hdml-line-width)/2);
    }
    :host([position=center]) {
      left: calc(50% - var(--hdml-line-width)/2);
    }
    :host([position=right]) {
      left: calc(100% - var(--hdml-line-width)/2);
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

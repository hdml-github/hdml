/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { Dimension } from "./AbstractScaleElement";
import { DirectionType, VerticalPosition } from "./AbstractDirection";
import { AbstractAxisElement } from "./AbstractAxisElement";

/**
 * Vertical axis element.
 */
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
      cursor: pointer;
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
     * The `dimension` property definition.
     */
    dimension: {
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

  private _dimension: Dimension = Dimension.Y;
  private _position: VerticalPosition = VerticalPosition.Left;

  /**
   * @override
   */
  public get type(): DirectionType {
    return DirectionType.Vertical;
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
  public set position(val: VerticalPosition) {
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
  public get position(): VerticalPosition {
    return this._position;
  }
}

customElements.define("vertical-axis", VerticalAxisElement);

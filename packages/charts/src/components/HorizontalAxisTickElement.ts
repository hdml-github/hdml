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
import { AbstractAxisTickElement } from "./AbstractAxisTickElement";

/**
 * Horizontal axis tick element.
 */
// eslint-disable-next-line max-len
export class HorizontalAxisTickElement extends AbstractAxisTickElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
    :host {
      display: block;
      position: absolute;
      width: 100%;
      border: none;
    }
    :host([position=top]) {
      top: 0%;
    }
    :host([position=center]) {
      top: 50%;
    }
    :host([position=bottom]) {
      top: 100%;
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

    /**
     * The `count` property definition.
     */
    count: {
      type: Number,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
      converter: {
        fromAttribute: (value: string): null | number => {
          if (!value) {
            return null;
          } else {
            try {
              const val = <unknown>JSON.parse(value);
              if (typeof val !== "number" || isNaN(val)) {
                return null;
              } else {
                return val;
              }
            } catch (err) {
              console.error(err);
              return null;
            }
          }
        },
        toAttribute: (value: number): string => {
          return value === null ? "" : JSON.stringify(value);
        },
      },
    },

    /**
     * The `values` property definition.
     */
    values: {
      type: Array,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
      converter: {
        fromAttribute: (
          value: string,
        ): null | number[] | string[] => {
          if (!value) {
            return null;
          } else {
            try {
              const val = <unknown>JSON.parse(value);
              if (!Array.isArray(val)) {
                return null;
              } else {
                return val as number[] | string[];
              }
            } catch (err) {
              console.error(err);
              return null;
            }
          }
        },
        toAttribute: (value: null | number[] | string[]): string => {
          return value === null ? "" : JSON.stringify(value);
        },
      },
    },
  };

  private _dimension: Dimension = Dimension.X;
  private _position: HorizontalPosition = HorizontalPosition.Bottom;
  private _count: null | number = null;
  private _values: null | number[] | string[] = null;

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

  /**
   * The `count` setter.
   */
  public set count(val: null | number) {
    const attr = this.getAttribute("count");
    const sval = val === null ? "" : JSON.stringify(val);
    if (attr !== sval) {
      this.setAttribute("count", sval);
    }
    const old = this._count;
    this._count = val;
    this.requestUpdate("count", old);
  }

  /**
   * The `count` getter.
   */
  public get count(): null | number {
    return this._count;
  }

  /**
   * The `values` setter.
   */
  public set values(val: null | number[] | string[]) {
    const attr = this.getAttribute("values");
    const sval = val === null ? "" : JSON.stringify(val);
    if (attr !== sval) {
      this.setAttribute("values", sval);
    }
    const old = this._values;
    this._values = val;
    this.requestUpdate("values", old);
  }

  /**
   * The `values` getter.
   */
  public get values(): null | number[] | string[] {
    return this._values;
  }
}

customElements.define(
  "horizontal-axis-tick",
  HorizontalAxisTickElement,
);

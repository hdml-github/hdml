/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { type ScaleLinear, scaleLinear } from "d3";
import {
  AbstractScaleElement,
  Dimension,
} from "./AbstractScaleElement";

export class LinearScaleElement extends AbstractScaleElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
    :host {
      margin: 0 !important;
    }
    :host,
    :host > slot {
      width: 100%;
      height: 100%;
      padding: 0;
      display: block !important;
      position: absolute !important;
      box-sizing: border-box !important;
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
     * The `min` property definition.
     */
    min: {
      type: Number,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
      converter: {
        fromAttribute: (value: string): number => {
          if (!value) {
            return 0;
          } else {
            try {
              const val = <unknown>JSON.parse(value);
              if (typeof val !== "number" || isNaN(val)) {
                return 0;
              } else {
                return val;
              }
            } catch (err) {
              console.error(err);
              return 0;
            }
          }
        },
        toAttribute: (value: number): string => {
          return JSON.stringify(value);
        },
      },
    },

    /**
     * The `max` property definition.
     */
    max: {
      type: Number,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
      converter: {
        fromAttribute: (value: string): number => {
          if (!value) {
            return 1;
          } else {
            try {
              const val = <unknown>JSON.parse(value);
              if (typeof val !== "number" || isNaN(val)) {
                return 1;
              } else {
                return val;
              }
            } catch (err) {
              console.error(err);
              return 1;
            }
          }
        },
        toAttribute: (value: number): string => {
          return JSON.stringify(value);
        },
      },
    },
  };

  private _min = 0;
  private _max = 1;
  private _scale: null | ScaleLinear<number, number, never> = null;

  /**
   * The `min` setter.
   */
  public set min(val: number) {
    const attr = this.getAttribute("min");
    const sval = JSON.stringify(val);
    if (attr !== sval) {
      this.setAttribute("min", sval);
    }
    const old = this._min;
    this._min = val;
    this.requestUpdate("min", old);
  }

  /**
   * The `min` getter.
   */
  public get min(): number {
    return this._min;
  }

  /**
   * The `max` setter.
   */
  public set max(val: number) {
    const attr = this.getAttribute("max");
    const sval = JSON.stringify(val);
    if (attr !== sval) {
      this.setAttribute("max", sval);
    }
    const old = this._max;
    this._max = val;
    this.requestUpdate("max", old);
  }

  /**
   * The `max` getter.
   */
  public get max(): number {
    return this._max;
  }

  /**
   * The `D3` scale object getter.
   */
  public get scale(): null | ScaleLinear<number, number, never> {
    return this._scale;
  }

  /**
   * @override
   */
  public shouldUpdate(
    changedProperties: Map<string, unknown>,
  ): boolean {
    if (
      changedProperties.has("max") ||
      changedProperties.has("min")
    ) {
      return true;
    }
    return super.shouldUpdate(changedProperties);
  }

  /**
   * @override
   */
  protected firstUpdated(
    changedProperties: Map<PropertyKey, unknown>,
  ): void {
    const attrMin = this.getAttribute("min");
    const svalMin = JSON.stringify(this.min);
    const attrMax = this.getAttribute("max");
    const svalMax = JSON.stringify(this.max);
    if (attrMin !== svalMin) {
      this.setAttribute("min", svalMin);
    }
    if (attrMax !== svalMax) {
      this.setAttribute("max", svalMax);
    }
    super.firstUpdated(changedProperties);
  }

  /**
   * @override
   */
  protected updateScale(): void {
    let fp = 0;
    let pv = 0;
    let lv = 0;
    let rv = 0;
    if (this.dimension === Dimension.X) {
      fp = this.tracked.paddingLeft + this.tracked.paddingRight;
      pv = (fp * (this.max - this.min)) / (this.tracked.width - fp);
      lv = fp ? (pv * this.tracked.paddingLeft) / fp : 0;
      rv = fp ? (pv * this.tracked.paddingRight) / fp : 0;
    }
    if (this.dimension === Dimension.Y) {
      fp = this.tracked.paddingTop + this.tracked.paddingBottom;
      pv = (fp * (this.max - this.min)) / (this.tracked.height - fp);
      lv = fp ? (pv * this.tracked.paddingTop) / fp : 0;
      rv = fp ? (pv * this.tracked.paddingBottom) / fp : 0;
    }
    const domain = [this.min - lv, this.max + rv];
    const scale = scaleLinear(domain, this.range);
    this._scale = scale;
  }
}

customElements.define("linear-scale", LinearScaleElement);

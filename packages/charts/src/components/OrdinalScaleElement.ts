/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { type ScaleBand, scaleBand } from "d3";
import {
  AbstractScaleElement,
  Dimension,
} from "./AbstractScaleElement";

export class OrdinalScaleElement extends AbstractScaleElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
    :host,
    :host > slot {
      display: block;
      position: absolute;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
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
     * The `bandwidth` property definition.
     */
    bandwidth: {
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
              if (typeof val !== "number" || isNaN(val) || val > 1) {
                return 1;
              } else if (val < 0) {
                return 0;
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
        fromAttribute: (value: string): Array<string> => {
          if (!value) {
            return [];
          } else {
            try {
              const res = <unknown>JSON.parse(value);
              if (Array.isArray(res)) {
                res.forEach((v) => {
                  if (typeof v !== "string") {
                    throw new Error(
                      "The `values` attribute must be an array of" +
                        " strings.",
                    );
                  }
                });
                return <Array<string>>res;
              } else {
                throw new Error(
                  "The `values` attribute must be an array of" +
                    " strings.",
                );
              }
            } catch (err) {
              console.error(err);
              return [];
            }
          }
        },
        toAttribute: (value: Array<string>): string => {
          return JSON.stringify(value);
        },
      },
    },

    /**
     * The `rest` property definition.
     */
    rest: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
      converter: {
        fromAttribute: (value: string): null | string => {
          if (!value) {
            return null;
          } else {
            try {
              const val = <unknown>JSON.parse(value);
              if (typeof val !== "string") {
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
        toAttribute: (value: null | string): string => {
          return JSON.stringify(value);
        },
      },
    },
  };

  private _bandwidth = 1;
  private _values: Array<string> = [];
  private _rest: null | string = null;
  private _scale: null | ScaleBand<string> = null;

  /**
   * The `bandwidth` setter.
   */
  public set bandwidth(val: number) {
    const attr = this.getAttribute("bandwidth");
    const sval = JSON.stringify(val);
    if (attr !== sval) {
      this.setAttribute("bandwidth", sval);
    }
    const old = this._bandwidth;
    this._bandwidth = val;
    this.requestUpdate("bandwidth", old);
  }

  /**
   * The `bandwidth` getter.
   */
  public get bandwidth(): number {
    return this._bandwidth;
  }

  /**
   * The `values` setter.
   */
  public set values(val: Array<string>) {
    const attr = this.getAttribute("values");
    const sval = JSON.stringify(val);
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
  public get values(): Array<string> {
    return this._values;
  }

  /**
   * The `rest` setter.
   */
  public set rest(val: null | string) {
    const attr = this.getAttribute("rest");
    const sval = JSON.stringify(val);
    if (attr !== sval) {
      this.setAttribute("rest", sval);
    }
    const old = this._rest;
    this._rest = val;
    this.requestUpdate("rest", old);
  }

  /**
   * The `rest` getter.
   */
  public get rest(): null | string {
    return this._rest;
  }

  /**
   * The `D3` scale object getter.
   */
  public get scale(): null | ScaleBand<string> {
    return this._scale;
  }

  /**
   * @override
   */
  public shouldUpdate(
    changedProperties: Map<string, unknown>,
  ): boolean {
    if (
      changedProperties.has("bandwidth") ||
      changedProperties.has("values") ||
      changedProperties.has("rest")
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
    const attrBandwidth = this.getAttribute("bandwidth");
    const svalBandwidth = JSON.stringify(this.bandwidth);
    const attrValues = this.getAttribute("values");
    const svalValues = JSON.stringify(this.values);
    const attrRest = this.getAttribute("rest");
    const svalRest = JSON.stringify(this.rest);
    if (attrBandwidth !== svalBandwidth) {
      this.setAttribute("bandwidth", svalBandwidth);
    }
    if (attrValues !== svalValues) {
      this.setAttribute("values", svalValues);
    }
    if (attrRest !== svalRest) {
      this.setAttribute("rest", svalRest);
    }
    super.firstUpdated(changedProperties);
  }

  /**
   * @override
   */
  protected updateScale(): void {
    if (!this.values.length) {
      this._scale = null;
    } else {
      const domain = [...this.values];
      if (this.rest) {
        domain.push(this.rest);
      }
      const div = domain.length - 1 || 1;
      let fp = 0;
      let op = 0;
      let al = 0;
      const scale = scaleBand(domain, this.range);
      scale.paddingInner(1 - this.bandwidth);
      if (this.dimension === Dimension.X) {
        fp = this.tracked.paddingLeft + this.tracked.paddingRight;
        op = fp / (2 * (scale.step() - fp / div));
        al = fp ? this.tracked.paddingLeft / fp : 0.5;
      }
      if (this.dimension === Dimension.Y) {
        fp = this.tracked.paddingTop + this.tracked.paddingBottom;
        op = fp / (2 * (scale.step() - fp / div));
        al = fp ? this.tracked.paddingTop / fp : 0.5;
      }
      scale.paddingOuter(op);
      scale.align(al);
      this._scale = scale;
    }
  }
}

customElements.define("ordinal-scale", OrdinalScaleElement);

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { AbstractChartElement } from "./AbstractChartElement";

/**
 *
 */
export class SeriesElement extends AbstractChartElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
    :host {
      display: block;
      position: absolute;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      padding: 0;
      background: rgba(0, 0, 0, 0);
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

  private _values: null | number[] | string[] = null;

  /**
   * @implements
   */
  protected get geometrySelector(): null | string {
    return null;
  }

  /**
   * The `values` attribute.
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
   * The `values` attribute.
   */
  public get values(): null | number[] | string[] {
    return this._values;
  }

  /**
   * @override
   */
  public render(): lit.TemplateResult<1> {
    return lit.html`
      <slot></slot>
    `;
  }

  /**
   * @override
   */
  public shouldUpdate(
    changedProperties: Map<string, unknown>,
  ): boolean {
    if (
      changedProperties.has("_force") ||
      changedProperties.has("values")
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
    const attrValues = this.getAttribute("values");
    const svalValues = this.values;
    if (attrValues !== svalValues) {
      this.setAttribute(
        "values",
        !svalValues ? "[]" : JSON.stringify(svalValues),
      );
    }
    super.firstUpdated(changedProperties);
  }

  /**
   * @implements
   */
  protected renderGeometry(): void {
    //
  }

  /**
   * @implements
   */
  protected updateGeometry(): void {
    //
  }
}

export class XSeriesElement extends SeriesElement {}
export class YSeriesElement extends SeriesElement {}
export class ZSeriesElement extends SeriesElement {}
export class ISeriesElement extends SeriesElement {}
export class JSeriesElement extends SeriesElement {}

customElements.define("x-series", XSeriesElement);
customElements.define("y-series", YSeriesElement);
customElements.define("z-series", ZSeriesElement);
customElements.define("i-series", ISeriesElement);
customElements.define("j-series", JSeriesElement);

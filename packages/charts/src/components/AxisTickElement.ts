/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { type Selection, axisBottom } from "d3";
import { HorizontalAxisElement } from "./HorizontalAxisElement";
import { BaseChartElement } from "./BaseChartElement";

export class AxisTickElement extends BaseChartElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
    :host {
      display: block;
      position: absolute;
      box-sizing: border-box;
      border: 1px solid black;
    }
    :host > slot {
      display: flex;
      align-items: center;
    }
    :host-context(horizontal-axis) {
      width: 100%;
      height: 5px;
      left: 0;
      top: 0;
    }
    :host-context(vertical-axis) {
      width: 5px;
      height: 100%;
      right: 0;
      top: 0;
    }
    :host-context(horizontal-axis[position=top]) {
      bottom: 0;
    }
    :host-context(horizontal-axis[position=center]),
    :host-context(horizontal-axis[position=bottom]) {
      top: 0;
    }
    :host-context(vertical-axis[position=left]),
    :host-context(vertical-axis[position=center]) {
      right: 0;
    }
    :host-context(vertical-axis[position=right]) {
      left: 0;
    }
    :host-context(horizontal-axis) > slot {
      flex-direction: column;
    }
    :host-context(vertical-axis) > slot {
      flex-direction: row;
    }
  `;

  /**
   * Reactive attributes.
   */
  public static properties = {
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

  private _count: null | number = null;
  private _values: null | number[] | string[] = null;

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

  /**
   * @override
   */
  public render(): lit.TemplateResult<1> {
    return lit.html`<slot></slot>`;
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  /**
   * @override
   */
  protected firstUpdated(
    changedProperties: Map<PropertyKey, unknown>,
  ): void {
    super.firstUpdated(changedProperties);

    const attrVals = this.getAttribute("values");
    const svalVals =
      this.values === null ? "" : JSON.stringify(this.values);
    if (attrVals !== svalVals) {
      this.setAttribute("values", svalVals);
    }

    const attrCount = this.getAttribute("count");
    const svalCount =
      this.count === null ? "" : JSON.stringify(this.count);
    if (attrCount !== svalCount) {
      this.setAttribute("count", svalCount);
    }

    this.renderSvgElements();
  }

  /**
   * @override
   */
  protected updated(changed: Map<string, unknown>): void {
    super.updated(changed);
  }

  /**
   * @override
   */
  protected trackedStylesChanged(): void {
    //
  }

  private renderSvgElements(): void {
    if (
      this.parentElement &&
      this.parentElement instanceof HorizontalAxisElement &&
      this.parentElement.svgGSelection
    ) {
      if (this.values?.length) {
        this.parentElement.svgGSelection.call(
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          axisBottom(this.parentElement.scale.scale)
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .tickValues(this.values)
            .tickSizeInner(5)
            .tickSizeOuter(0),
        );
      } else {
        const count = this.count ? this.count : 5;
        this.parentElement.svgGSelection.call(
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          axisBottom(this.parentElement.scale.scale)
            .ticks(count)
            .tickSizeInner(5)
            .tickSizeOuter(0),
        );
      }
    }
  }
}
customElements.define("axis-tick", AxisTickElement);

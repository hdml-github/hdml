/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { axisBottom, axisTop, axisLeft, axisRight } from "d3";
import { HorizontalAxisElement } from "./HorizontalAxisElement";
import { VerticalAxisElement } from "./VerticalAxisElement";
import { AbstractChartElement } from "./AbstractChartElement";
import { AxisType } from "./AbstractAxisElement";

export class AxisTickElement extends AbstractChartElement {
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
     * Private property to force updates.
     */
    _force: {
      type: Boolean,
      attribute: false,
      reflect: false,
      state: false,
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

  private _count: null | number = null;
  private _values: null | number[] | string[] = null;

  /**
   * @implements
   */
  protected get geometrySelector(): null | string {
    if (!this.axis) {
      return null;
    } else {
      return (
        `:host > svg ` +
        `g.${this.axis.direction}-axis ` +
        `g.tick line`
      );
    }
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

  /**
   * Associated axis element.
   */
  public get axis():
    | null
    | HorizontalAxisElement
    | VerticalAxisElement {
    if (
      this.parentElement &&
      (this.parentElement instanceof HorizontalAxisElement ||
        this.parentElement instanceof VerticalAxisElement)
    ) {
      return this.parentElement;
    }
    return null;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    if (this.axis) {
      this.axis.addEventListener("updated", this.axisUpdatedListener);
      if (this.axis.scale) {
        this.axis.scale.addEventListener(
          "updated",
          this.axisUpdatedListener,
        );
      }
    }
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    if (this.axis) {
      this.axis.removeEventListener(
        "updated",
        this.axisUpdatedListener,
      );
      if (this.axis.scale) {
        this.axis.scale.removeEventListener(
          "updated",
          this.axisUpdatedListener,
        );
      }
    }
    super.disconnectedCallback();
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
  public shouldUpdate(
    changedProperties: Map<string, unknown>,
  ): boolean {
    if (
      changedProperties.has("_force") ||
      changedProperties.has("count") ||
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
    const attrVals = this.getAttribute("values");
    const svalVals =
      this.values === null ? "" : JSON.stringify(this.values);
    const attrCount = this.getAttribute("count");
    const svalCount =
      this.count === null ? "" : JSON.stringify(this.count);
    if (attrVals !== svalVals) {
      this.setAttribute("values", svalVals);
    }
    if (attrCount !== svalCount) {
      this.setAttribute("count", svalCount);
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
   * @override
   */
  protected updateGeometry(): void {
    if (this.axis && this.axis.selection) {
      let size = 0;
      let axisFn;
      if (this.axis.type === AxisType.Horizontal) {
        size = this.tracked.height;
        switch (this.axis.position) {
          case "top":
            axisFn = axisTop;
            break;
          case "center":
          case "bottom":
            axisFn = axisBottom;
            break;
        }
      } else if (this.axis.type === AxisType.Vertical) {
        size = this.tracked.width;
        switch (this.axis.position) {
          case "right":
            axisFn = axisRight;
            break;
          case "center":
          case "left":
            axisFn = axisLeft;
            break;
        }
      }
      if (this.values?.length) {
        this.axis.selection.call(
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          axisFn(this.axis.scale.scale)
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .tickValues(this.values as Iterable<string>)
            .tickSizeInner(size)
            .tickSizeOuter(0),
        );
      } else {
        this.axis.selection.call(
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          axisFn(this.axis.scale.scale)
            .ticks(this.count ? this.count : 5)
            .tickSizeInner(size)
            .tickSizeOuter(0),
        );
      }
    }
  }

  /**
   * Associated axis `styles-changed` event listener.
   */
  private axisUpdatedListener = () => {
    this.requestUpdate("_force", true);
  };
}

customElements.define("axis-tick", AxisTickElement);

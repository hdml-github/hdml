/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { area } from "d3";
import { lit } from "@hdml/elements";
import { AbstractChartElement } from "./AbstractChartElement";
import { Dimension } from "./AbstractScaleElement";
import { OrdinalScaleElement } from "./OrdinalScaleElement";
import { LinearScaleElement } from "./LinearScaleElement";
import { SeriesElement } from "./SeriesElement";

export type ScaleElement = OrdinalScaleElement | LinearScaleElement;

type AreaType =
  | "natural"
  | "linear"
  | "cubic"
  | "step"
  | "bezier"
  | "basis"
  | "cardinal"
  | "catmull-rom";

/**
 *
 */
class DataAreaElement extends AbstractChartElement {
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
     * The `type` property definition.
     */
    type: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
      converter: {
        fromAttribute: (value: string): AreaType => {
          if (!value) {
            return "natural";
          } else {
            if (
              value === "natural" ||
              value === "linear" ||
              value === "cubic" ||
              value === "step" ||
              value === "bezier" ||
              value === "basis" ||
              value === "cardinal" ||
              value === "catmull-rom"
            ) {
              return value;
            } else {
              return "natural";
            }
          }
        },
        toAttribute: (value: string): string => {
          return value;
        },
      },
    },
  };

  private _type: AreaType = "natural";

  /**
   * @implements
   */
  protected get geometrySelector(): null | string {
    return `:host > svg path#_${this.uid}`;
  }

  /**
   * X axis scale.
   */
  public get scaleX(): null | ScaleElement {
    let cnt = 0;
    let parent: null | HTMLElement | ScaleElement =
      this.parentElement;
    while (parent && cnt <= 15) {
      if (
        (parent instanceof LinearScaleElement ||
          parent instanceof OrdinalScaleElement) &&
        parent.dimension === Dimension.X
      ) {
        return parent;
      } else {
        cnt++;
        parent = parent.parentElement;
      }
    }
    return null;
  }

  /**
   * Y axis scale.
   */
  public get scaleY(): null | ScaleElement {
    let cnt = 0;
    let parent: null | HTMLElement | ScaleElement =
      this.parentElement;
    while (parent && cnt <= 15) {
      if (
        (parent instanceof LinearScaleElement ||
          parent instanceof OrdinalScaleElement) &&
        parent.dimension === Dimension.Y
      ) {
        return parent;
      } else {
        cnt++;
        parent = parent.parentElement;
      }
    }
    return null;
  }

  /**
   * X series.
   */
  public get seriesX(): null | SeriesElement {
    let cnt = 0;
    let parent: null | HTMLElement | SeriesElement =
      this.parentElement;
    while (parent && cnt <= 5) {
      if (
        parent instanceof SeriesElement &&
        parent.tagName.toLowerCase() === "x-series"
      ) {
        return parent;
      } else {
        cnt++;
        parent = parent.parentElement;
      }
    }
    return null;
  }

  /**
   * Y series.
   */
  public get seriesY(): null | SeriesElement {
    let cnt = 0;
    let parent: null | HTMLElement | SeriesElement =
      this.parentElement;
    while (parent && cnt <= 5) {
      if (
        parent instanceof SeriesElement &&
        parent.tagName.toLowerCase() === "y-series"
      ) {
        return parent;
      } else {
        cnt++;
        parent = parent.parentElement;
      }
    }
    return null;
  }

  /**
   * @override
   */
  public set type(val: AreaType) {
    const attr = this.getAttribute("type");
    const sval = val;
    if (attr !== sval) {
      this.setAttribute("type", sval);
    }
    const old = this._type;
    this._type = val;
    this.requestUpdate("type", old);
  }

  /**
   * @override
   */
  public get type(): AreaType {
    return this._type;
  }

  /**
   * @override
   */
  public shouldUpdate(
    changedProperties: Map<string, unknown>,
  ): boolean {
    if (
      changedProperties.has("_force") ||
      changedProperties.has("type")
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
    const attrType = this.getAttribute("type");
    const svalType = this.type;
    if (attrType !== svalType) {
      this.setAttribute("type", svalType);
    }
    super.firstUpdated(changedProperties);
  }

  /**
   * @implements
   */
  protected renderGeometry(): void {
    if (this.view?.svg) {
      this.view.svg
        .append("path")
        .attr("id", `_${this.uid}`)
        .attr("tabindex", "-1")
        .attr("d", this.getPathD());
    }
  }

  /**
   * @implements
   */
  protected updateGeometry(): void {
    //
  }

  private getPathD(): string {
    if (
      this.scaleX &&
      this.scaleX.scale &&
      this.seriesX &&
      this.seriesX.values &&
      this.scaleY &&
      this.scaleY.scale &&
      this.seriesY &&
      this.seriesY.values
    ) {
      const xLength = this.seriesX.values.length;
      const yLength = this.seriesY.values.length;
      const length = xLength <= yLength ? xLength : yLength;
      const dataset: [number, number][] = [];
      for (let i = 0; i <= length; i++) {
        const xVal = <string & { valueOf(): number }>(
          this.seriesX.values[i]
        );
        const yVal = <string & { valueOf(): number }>(
          this.seriesY.values[i]
        );
        const x = this.scaleX.scale(xVal) || 0;
        const y = this.scaleX.scale(yVal) || 0;
        dataset.push([x, y]);
      }
      const y0 =
        this.scaleX.scale(<string & { valueOf(): number }>"t0") || 0;
      const _area = area<[number, number]>()
        .x((el) => el[0])
        .y0(() => y0)
        .y1((el) => el[1]);
      return _area(dataset) || "M0,0";
    }
    return "M0,0";
  }
}
customElements.define("data-area", DataAreaElement);

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { area, type Selection } from "d3";
import { lit } from "@hdml/elements";
import { AbstractChartElement } from "./AbstractChartElement";
import { Dimension } from "./AbstractScaleElement";
import { OrdinalScaleElement } from "./OrdinalScaleElement";
import { LinearScaleElement } from "./LinearScaleElement";

type ScaleElement = OrdinalScaleElement | LinearScaleElement;
type AreaType =
  | "natural"
  | "linear"
  | "cubic"
  | "step"
  | "bezier"
  | "basis"
  | "cardinal"
  | "catmull-rom";
type SelectedPath = Selection<
  SVGPathElement,
  unknown,
  null,
  undefined
>;

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

    /**
     * The `x` property definition.
     */
    x: {
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

    /**
     * The `y0` property definition.
     */
    y0: {
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

    /**
     * The `y1` property definition.
     */
    y1: {
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

  private _selectedPath: null | SelectedPath = null;
  private _type: AreaType = "natural";
  private _y0: null | number[] | string[] = null;
  private _y1: null | number[] | string[] = null;
  private _x: null | number[] | string[] = null;

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
   * The `x` attribute.
   */
  public set x(val: null | number[] | string[]) {
    const attr = this.getAttribute("x");
    const sval = val === null ? "" : JSON.stringify(val);
    if (attr !== sval) {
      this.setAttribute("x", sval);
    }
    const old = this._x;
    this._x = val;
    this.requestUpdate("x", old);
  }

  /**
   * The `x` attribute.
   */
  public get x(): null | number[] | string[] {
    return this._x;
  }

  /**
   * The `y0` attribute.
   */
  public set y0(val: null | number[] | string[]) {
    const attr = this.getAttribute("y0");
    const sval = val === null ? "" : JSON.stringify(val);
    if (attr !== sval) {
      this.setAttribute("y0", sval);
    }
    const old = this._y0;
    this._y0 = val;
    this.requestUpdate("y0", old);
  }

  /**
   * The `y0` attribute.
   */
  public get y0(): null | number[] | string[] {
    return this._y0;
  }

  /**
   * The `y1` attribute.
   */
  public set y1(val: null | number[] | string[]) {
    const attr = this.getAttribute("y1");
    const sval = val === null ? "" : JSON.stringify(val);
    if (attr !== sval) {
      this.setAttribute("y1", sval);
    }
    const old = this._y1;
    this._y1 = val;
    this.requestUpdate("y1", old);
  }

  /**
   * The `y1` attribute.
   */
  public get y1(): null | number[] | string[] {
    return this._y1;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    this.renderGeometry();
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    this._selectedPath?.remove();
    super.disconnectedCallback();
  }

  /**
   * @override
   */
  public shouldUpdate(
    changedProperties: Map<string, unknown>,
  ): boolean {
    if (
      changedProperties.has("_force") ||
      changedProperties.has("type") ||
      changedProperties.has("y0") ||
      changedProperties.has("y1") ||
      changedProperties.has("x")
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
    const attrX = this.getAttribute("x");
    const svalX = JSON.stringify(this.x);
    if (attrX !== svalX) {
      this.setAttribute("x", svalX);
    }
    const attrY0 = this.getAttribute("y0");
    const svalY0 = JSON.stringify(this.y0);
    if (attrY0 !== svalY0) {
      this.setAttribute("y0", svalY0);
    }
    const attrY1 = this.getAttribute("y1");
    const svalY1 = JSON.stringify(this.y1);
    if (attrY1 !== svalY1) {
      this.setAttribute("y1", svalY1);
    }
    super.firstUpdated(changedProperties);
  }

  /**
   * @implements
   */
  protected renderGeometry(): void {
    if (this.view?.svg && !this._selectedPath) {
      this._selectedPath = this.view.svg
        .append("path")
        .attr("id", `_${this.uid}`)
        .attr("tabindex", "-1")
        .attr("d", this.getPathD());
    } else if (this.view?.svg && this._selectedPath) {
      this.view.svg.insert(() => {
        if (this._selectedPath) {
          return this._selectedPath.node();
        } else {
          return null;
        }
      });
    }
  }

  /**
   * @implements
   */
  protected updateGeometry(): void {
    if (this._selectedPath) {
      this._selectedPath.attr("d", this.getPathD());
    }
  }

  /**
   * Returns area path `d` property value.
   */
  private getPathD(): string {
    if (
      this.scaleX &&
      this.scaleX.scale &&
      this.scaleY &&
      this.scaleY.scale &&
      this.x &&
      this.y0 &&
      this.y1
    ) {
      const scaleX = this.scaleX.scale;
      const scaleY = this.scaleY.scale;
      const x = this.x;
      const y0 = this.y0;
      const y1 = this.y1;
      const length = Math.max(
        this.x.length,
        this.y0.length,
        this.y1.length,
      );
      const array = new Array<[number, number]>(length);
      const getPathD = area()
        .x(
          (_, i) => scaleX(<string & { valueOf(): number }>x[i]) || 0,
        )
        .y0(
          (_, i) =>
            scaleY(<string & { valueOf(): number }>y0[i]) || 0,
        )
        .y1(
          (_, i) =>
            scaleY(<string & { valueOf(): number }>y1[i]) || 0,
        );
      return getPathD(array) || "M0,0";
    }
    return "M0,0";
  }
}
customElements.define("data-area", DataAreaElement);

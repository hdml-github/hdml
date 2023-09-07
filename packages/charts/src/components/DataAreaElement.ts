/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  area,
  curveBumpX,
  curveBumpY,
  curveBundle,
  curveCardinal,
  curveCatmullRom,
  curveLinear,
  curveMonotoneX,
  curveMonotoneY,
  curveNatural,
  curveStep,
  curveStepAfter,
  curveStepBefore,
  type Selection,
  type CurveFactory,
  type CurveBundleFactory,
  type CurveCardinalFactory,
  type CurveCatmullRomFactory,
} from "d3";
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
type AxisEvent = (MouseEvent | PointerEvent | FocusEvent) & {
  datum?: [undefined | number | string, undefined | number | string];
};

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
  private _events: Set<string> = new Set();
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
  public addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (
      this: HTMLElement,
      ev: HTMLElementEventMap[K],
    ) => unknown,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void;
  public addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void {
    if (!this._events.has(type)) {
      this._events.add(type);
      this._selectedPath?.on(type, this.proxyEvent.bind(this));
    }
    super.addEventListener(type, listener, options);
  }

  /**
   * @override
   */
  public removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (
      this: HTMLElement,
      ev: HTMLElementEventMap[K],
    ) => unknown,
    options?: boolean | EventListenerOptions | undefined,
  ): void;
  public removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions | undefined,
  ): void {
    if (this._events.has(type)) {
      this._events.delete(type);
      this._selectedPath?.on(type, null);
    }
    super.removeEventListener(type, listener, options);
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
        .curve(<CurveFactory>this.getCurve())
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

  /**
   * Returns curve factory.
   */
  private getCurve():
    | CurveFactory
    | CurveBundleFactory
    | CurveCardinalFactory
    | CurveCatmullRomFactory {
    switch (this.tracked.curveType) {
      case "natural":
        return curveNatural;
      case "linear":
        return curveLinear;
      case "cubic":
        if (this.tracked.curveCubicMonotonicity === "y") {
          return curveMonotoneY;
        } else {
          return curveMonotoneX;
        }
      case "step":
        if (this.tracked.curveStepChange === "before") {
          return curveStepBefore;
        } else if (this.tracked.curveStepChange === "after") {
          return curveStepAfter;
        } else {
          return curveStep;
        }
      case "bezier":
        if (this.tracked.curveBezierTangents === "vertical") {
          return curveBumpY;
        } else {
          return curveBumpX;
        }
      case "basis":
        return curveBundle.beta(this.tracked.curveBasisBeta);
      case "cardinal":
        return curveCardinal.tension(
          this.tracked.curveCardinalTension,
        );
      case "catmull-rom":
        return curveCatmullRom.alpha(
          this.tracked.curveCatmullRomAlpha,
        );
    }
  }

  /**
   * Proxy the `event` of the `svg` element to the `hdml` element.
   */
  private proxyEvent = (event: Event) => {
    let evt: AxisEvent;
    let datum:
      | undefined
      | [undefined | number | string, undefined | number | string];
    if (
      event instanceof MouseEvent ||
      event instanceof PointerEvent
    ) {
      datum = this.getDatum(event.clientX, event.clientY);
    }
    switch (event.type) {
      case "mouseenter":
      case "mouseleave":
      case "mousemove":
      case "mouseover":
      case "mouseout":
      case "mousedown":
      case "mouseup":
        evt = new MouseEvent(event.type);
        evt.datum = datum;
        this.dispatchEvent(evt);
        break;
      case "click":
        evt = new PointerEvent(event.type);
        evt.datum = datum;
        this.dispatchEvent(evt);
        break;
      case "focus":
      case "blur":
        evt = new FocusEvent(event.type);
        this.dispatchEvent(evt);
        break;
    }
  };

  /**
   * Returns the datum associated with a point on an axis.
   */
  private getDatum(
    mouseX: number,
    mouseY: number,
  ): [undefined | number | string, undefined | number | string] {
    const datum: [
      undefined | number | string,
      undefined | number | string,
    ] = [undefined, undefined];
    const elemLeft = this.view?.getClientRects()[0].left || 0;
    const elemTop = this.view?.getClientRects()[0].top || 0;
    const x = mouseX - elemLeft;
    const y = mouseY - elemTop;
    if (this.scaleX instanceof LinearScaleElement) {
      datum[0] = this.scaleX.scale?.invert(x);
    } else if (this.scaleX instanceof OrdinalScaleElement) {
      const domain = this.scaleX.scale?.domain() || [];
      const step = this.scaleX.scale?.step() || 0;
      const range = this.scaleX.scale?.range() || [0, 0];
      const index = Math.round(
        (x - range[0] - this.scaleX.tracked.paddingLeft) / step,
      );
      datum[0] = domain.slice(0).reverse()[index];
    }
    if (this.scaleY instanceof LinearScaleElement) {
      datum[1] = this.scaleY.scale?.invert(y);
    } else if (this.scaleY instanceof OrdinalScaleElement) {
      const domain = this.scaleY.scale?.domain() || [];
      const step = this.scaleY.scale?.step() || 0;
      const range = this.scaleY.scale?.range() || [0, 0];
      const index = Math.round(
        (y - range[1] - this.scaleY.tracked.paddingTop) / step,
      );
      datum[1] = domain.slice(0).reverse()[index];
    }
    return datum;
  }
}
customElements.define("data-area", DataAreaElement);

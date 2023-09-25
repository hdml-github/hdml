/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  line,
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
 * Data line element.
 */
class DataLineElement extends AbstractChartElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
    :host {
      cursor: pointer;
      display: block !important;
      position: absolute !important;
      box-sizing: border-box !important;
      width: 100% !important;
      height: 100% !important;
      padding: 0 !important;
      background: rgba(0, 0, 0, 0) !important;
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
     * The `y` property definition.
     */
    y: {
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
  private _y: null | number[] | string[] = null;
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
   * The `y` attribute.
   */
  public set y(val: null | number[] | string[]) {
    const attr = this.getAttribute("y");
    const sval = val === null ? "" : JSON.stringify(val);
    if (attr !== sval) {
      this.setAttribute("y", sval);
    }
    const old = this._y;
    this._y = val;
    this.requestUpdate("y", old);
  }

  /**
   * The `y` attribute.
   */
  public get y(): null | number[] | string[] {
    return this._y;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    if (this.scaleX) {
      this.scaleX.addEventListener(
        "updated",
        this.scaleUpdatedListener,
      );
    }
    if (this.scaleY) {
      this.scaleY.addEventListener(
        "updated",
        this.scaleUpdatedListener,
      );
    }
    this.renderGeometry();
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    if (this.scaleX) {
      this.scaleX.removeEventListener(
        "updated",
        this.scaleUpdatedListener,
      );
    }
    if (this.scaleY) {
      this.scaleY.removeEventListener(
        "updated",
        this.scaleUpdatedListener,
      );
    }
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
      changedProperties.has("y") ||
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
    const attrX = this.getAttribute("x");
    const svalX = JSON.stringify(this.x);
    if (attrX !== svalX) {
      this.setAttribute("x", svalX);
    }
    const attrY = this.getAttribute("y");
    const svalY = JSON.stringify(this.y);
    if (attrY !== svalY) {
      this.setAttribute("y", svalY);
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
      this.y
    ) {
      const scaleX = this.scaleX.scale;
      const scaleY = this.scaleY.scale;
      const x = this.x;
      const y = this.y;
      const length = Math.max(this.x.length, this.y.length);
      const array = new Array<[number, number]>(length);
      const getPathD = line()
        .curve(<CurveFactory>this.getCurve())
        .x(
          (_, i) => scaleX(<string & { valueOf(): number }>x[i]) || 0,
        )
        .y(
          (_, i) => scaleY(<string & { valueOf(): number }>y[i]) || 0,
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

  /**
   * Associated scale component `updated` event listeners.
   */
  private scaleUpdatedListener = () => {
    this.requestUpdate("_force", true);
  };
}
customElements.define("data-line", DataLineElement);

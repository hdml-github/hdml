/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { type Selection, type EnterElement, type BaseType } from "d3";
import { lit } from "@hdml/elements";
import { AbstractChartElement } from "./AbstractChartElement";
import { Dimension } from "./AbstractScaleElement";
import { OrdinalScaleElement } from "./OrdinalScaleElement";
import { LinearScaleElement } from "./LinearScaleElement";

type ScaleElement = OrdinalScaleElement | LinearScaleElement;
export type SelectedGroup = Selection<
  SVGGElement,
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
class DataPointElement extends AbstractChartElement {
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

  private _group: null | SelectedGroup = null;
  private _style: null | "text" | "rect" | "ellipse" = null;
  private _events: Set<string> = new Set();
  private _y: null | number[] | string[] = null;
  private _x: null | number[] | string[] = null;

  /**
   * @implements
   */
  protected get geometrySelector(): null | string {
    return `:host > svg g#_${this.uid} g.point`;
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
    this.renderGeometry();
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    this._group?.remove();
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
      //
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
      //
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
    this.renderGroup();
  }

  /**
   * @implements
   */
  protected updateGeometry(): void {
    if (this._group && this.x && this.y) {
      if (this._style !== this.tracked.tickStyle) {
        this.removePoints();
      }
      const x = this.x;
      const y = this.y;
      const length = Math.max(x.length, y.length);
      const data: (string | number)[][] = [];
      for (let i = 0; i < length; i++) {
        data.push([x[i], y[i]]);
      }
      this._group
        .selectAll(".point")
        .data<(string | number)[]>(data)
        .order()
        .join(
          this.enterPoints.bind(this),
          this.updatePoints.bind(this),
          this.exitPoints.bind(this),
        );
      this._style = this.tracked.tickStyle;
    }
  }

  /**
   * Renders data point `svg` group.
   */
  private renderGroup(): void {
    if (this.view?.svg && !this._group) {
      this._group = this.view.svg
        .append("g")
        .attr("id", `_${this.uid}`);
    } else if (this.view?.svg) {
      this.view.svg.insert(() => {
        if (this._group) {
          return this._group.node();
        } else {
          return null;
        }
      });
    }
  }

  /**
   * Removes data points from the view if exists.
   */
  private removePoints(): void {
    if (this._group) {
      this._group
        .selectAll("g.point")
        .call((selection) => {
          this._events.forEach((type) => {
            selection.on(type, null);
          });
        })
        .remove();
    }
  }

  /**
   * Renders new data points.
   */
  private enterPoints(
    enter: Selection<
      EnterElement,
      (string | number)[],
      SVGGElement,
      unknown
    >,
  ): Selection<
    SVGGElement,
    (string | number)[],
    SVGGElement,
    unknown
  > {
    return enter
      .append("g")
      .attr("class", "point")
      .attr("tabindex", "-1")
      .attr("transform", this.getPointTranslation.bind(this))
      .call((selection) => {
        this._events.forEach((type) => {
          selection.on(type, this.proxyEvent.bind(this));
        });
        this.appendPoint(selection);
      });
  }

  /**
   * Updates existing data points.
   */
  private updatePoints(
    update: Selection<
      BaseType,
      (string | number)[],
      SVGGElement,
      unknown
    >,
  ): Selection<BaseType, (string | number)[], SVGGElement, unknown> {
    return update
      .attr("transform", this.getPointTranslation.bind(this))
      .call((selection) => {
        this.updatePoint(selection);
      });
  }

  /**
   * Removes data points that are related with the removed data.
   */
  private exitPoints(
    exit: Selection<BaseType, string | number, SVGGElement, unknown>,
  ): Selection<BaseType, string | number, SVGGElement, unknown> {
    return exit
      .call((selection) => {
        this._events.forEach((type) => {
          selection.on(type, null);
        });
      })
      .remove();
  }

  /**
   * Returns data point group traslate propperty.
   */
  private getPointTranslation(d: (number | string)[]): string {
    let deltaX = 0;
    let deltaY = 0;
    if (
      this.isConnected &&
      this.scaleX?.scale &&
      this.scaleY?.scale
    ) {
      if (this.scaleX instanceof OrdinalScaleElement) {
        const offs =
          Math.max(
            0,
            this.scaleX.scale.bandwidth() - this.getOffset() * 2,
          ) / 2;
        deltaX = this.scaleX.scale(<string>d[0]) || 0;
        deltaX = deltaX + offs;
      } else {
        deltaX = this.scaleX.scale(<number>d[0]) || 0;
      }
      if (this.scaleY instanceof OrdinalScaleElement) {
        const offs =
          Math.max(
            0,
            this.scaleY.scale.bandwidth() - this.getOffset() * 2,
          ) / 2;
        deltaY = this.scaleY.scale(<string>d[1]) || 0;
        deltaY = deltaY + offs;
      } else {
        deltaY = this.scaleY.scale(<number>d[1]) || 0;
      }
    }
    return `translate(${deltaX}, ${deltaY})`;
  }

  /**
   * Returns device related offset.
   */
  private getOffset(): number {
    return typeof window !== "undefined" &&
      window.devicePixelRatio > 1
      ? 0
      : 0; // 0.5;
  }

  /**
   * Append tick style.
   */
  private appendPoint(
    selection: Selection<
      SVGGElement,
      (string | number)[],
      SVGGElement,
      unknown
    >,
  ): void {
    switch (this.tracked.tickStyle) {
      default:
      case "ellipse":
        this.appendEllipse(selection);
        break;
      case "rect":
        this.appendRect(selection);
        break;
      case "text":
        this.appendText(selection);
        break;
    }
  }

  /**
   * Update tick style.
   */
  private updatePoint(
    selection: Selection<
      BaseType,
      (string | number)[],
      SVGGElement,
      unknown
    >,
  ): void {
    switch (this.tracked.tickStyle) {
      default:
      case "ellipse":
        this.updateEllipse(selection);
        break;
      case "rect":
        this.updateRect(selection);
        break;
      case "text":
        this.updateText(selection);
        break;
    }
  }

  /**
   * Append ellipse tick.
   */
  private appendEllipse(
    selection: Selection<
      SVGGElement,
      (string | number)[],
      SVGGElement,
      unknown
    >,
  ) {
    const dx = 0;
    const dy = 0;
    selection
      .append("ellipse")
      .attr("cx", 0 - dx)
      .attr("cy", 0 - dy)
      .attr("rx", this.tracked.tickWidth / 2)
      .attr("ry", this.tracked.tickHeight / 2);
  }

  /**
   * Update ellipse tick.
   */
  private updateEllipse(
    selection: Selection<
      BaseType,
      (string | number)[],
      SVGGElement,
      unknown
    >,
  ): void {
    const dx = 0;
    const dy = 0;
    selection
      .select("ellipse")
      .attr("cx", 0 - dx)
      .attr("cy", 0 - dy)
      .attr("rx", this.tracked.tickWidth / 2)
      .attr("ry", this.tracked.tickHeight / 2);
  }

  /**
   * Append rect tick.
   */
  private appendRect(
    selection: Selection<
      SVGGElement,
      (string | number)[],
      SVGGElement,
      unknown
    >,
  ) {
    selection
      .append("rect")
      .attr("x", 0 - this.tracked.tickWidth / 2)
      .attr("y", 0 - this.tracked.tickHeight / 2)
      .attr("width", this.tracked.tickWidth)
      .attr("height", this.tracked.tickHeight);
  }

  /**
   * Append rect tick.
   */
  private updateRect(
    selection: Selection<
      BaseType,
      (string | number)[],
      SVGGElement,
      unknown
    >,
  ) {
    const dx = 0;
    const dy = 0;
    selection
      .select("rect")
      .attr("x", 0 - dx)
      .attr("y", 0 - dy)
      .attr("width", this.tracked.tickWidth)
      .attr("height", this.tracked.tickHeight);
  }

  /**
   * Append text tick.
   */
  private appendText(
    selection: Selection<
      SVGGElement,
      (string | number)[],
      SVGGElement,
      unknown
    >,
  ) {
    const dx = 0;
    const dy = 0;
    selection
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("x", 0 - dx)
      .attr("y", 0 - dy)
      .text((v) => `${v[0]}, ${v[1]}`);
  }

  /**
   * Append text tick.
   */
  private updateText(
    selection: Selection<
      BaseType,
      (string | number)[],
      SVGGElement,
      unknown
    >,
  ) {
    const dx = 0;
    const dy = 0;
    selection
      .select("text")
      .attr("class", "elm")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("x", 0 - dx)
      .attr("y", 0 - dy)
      .text((v) => `${v[0]}; ${v[1]}`);
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
customElements.define("data-point", DataPointElement);

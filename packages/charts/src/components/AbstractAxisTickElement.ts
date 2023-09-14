/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { type Selection, type EnterElement, type BaseType } from "d3";
import { OrdinalScaleElement } from "./OrdinalScaleElement";
import { LinearScaleElement } from "./LinearScaleElement";
import {
  AbstractDirectionElement,
  DirectionType,
} from "./AbstractDirectionElement";

/**
 * Tick event.
 */
type TickEvent = (MouseEvent | PointerEvent | FocusEvent) & {
  datum?: number | string;
};

/**
 * The abstract class with the logic that is required to visualize the
 * ticks.
 */
// eslint-disable-next-line max-len
export abstract class AbstractAxisTickElement extends AbstractDirectionElement {
  private _tickStyle: null | "text" | "rect" | "ellipse" = null;
  private _events: Set<string> = new Set();

  /**
   * @implements
   */
  protected get geometrySelector(): null | string {
    return (
      `:host > svg g.${this.dimension}-dimension#_${this.uid} ` +
      `g.tick`
    );
  }

  /**
   * The `count` property definition.
   */
  public abstract get count(): null | number;

  /**
   * The `values` property definition.
   */
  public abstract get values(): null | number[] | string[];

  /**
   * @override
   */
  public shouldUpdate(
    changedProperties: Map<string, unknown>,
  ): boolean {
    if (
      changedProperties.has("count") ||
      changedProperties.has("values")
    ) {
      return true;
    }
    return super.shouldUpdate(changedProperties);
  }

  /**
   * @implements
   */
  protected updateGeometry(): void {
    super.updateGeometry();
    if (this.selectedGroup) {
      if (this._tickStyle !== this.tracked.tickStyle) {
        this.removeTicks();
      }
      this.selectedGroup
        .selectAll(".tick")
        .data<number | string>(this.getData())
        .order()
        .join(
          this.enterTicks.bind(this),
          this.updateTicks.bind(this),
          this.exitTicks.bind(this),
        );
      this._tickStyle = this.tracked.tickStyle;
    }
  }

  /**
   * Removes ticks from the view if exists.
   */
  private removeTicks(): void {
    if (this.selectedGroup) {
      this.selectedGroup
        .selectAll("g.tick")
        .call((selection) => {
          this._events.forEach((type) => {
            selection.on(type, null);
          });
        })
        .remove();
    }
  }

  /**
   * Returns ticks data array.
   */
  private getData(): number[] | string[] {
    let values: number[] | string[] = [];
    if (this.isConnected && this.scale && this.scale.scale) {
      if (this.scale instanceof LinearScaleElement) {
        if (this.values) {
          values = this.values;
        } else if (this.count) {
          values = this.scale.scale.ticks(this.count);
        } else {
          values = this.scale.scale.ticks(5);
        }
      } else if (this.scale instanceof OrdinalScaleElement) {
        if (this.values) {
          const scale = this.scale.scale;
          values = (<string[]>this.values).filter(
            (el: string) => scale.domain().indexOf(el) >= 0,
          );
        } else if (this.count) {
          values = this.scale.scale.domain().slice(0, this.count);
        } else {
          values = this.scale.scale.domain();
        }
      }
    }
    return values;
  }

  /**
   * Renders new ticks.
   */
  private enterTicks(
    enter: Selection<
      EnterElement,
      string | number,
      SVGGElement,
      unknown
    >,
  ): Selection<SVGGElement, string | number, SVGGElement, unknown> {
    return enter
      .append("g")
      .attr("class", "tick")
      .attr("tabindex", "-1")
      .attr("transform", this.getTransform.bind(this))
      .call((selection) => {
        this._events.forEach((type) => {
          selection.on(type, this.proxyEvent.bind(this));
        });
        this.appendTick(selection);
      });
  }

  /**
   * Updates existing ticks.
   */
  private updateTicks(
    update: Selection<
      BaseType,
      string | number,
      SVGGElement,
      unknown
    >,
  ): Selection<BaseType, string | number, SVGGElement, unknown> {
    return update
      .attr("transform", this.getTransform.bind(this))
      .call((selection) => {
        this.updateTick(selection);
      });
  }

  /**
   * Removes ticks that are related with the removed data.
   */
  private exitTicks(
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
   * Returns tick traslate propperty.
   */
  private getTransform(d: number | string): string {
    if (this.isConnected && this.scale && this.scale.scale) {
      let delta = 0;
      if (this.scale instanceof OrdinalScaleElement) {
        const offs =
          Math.max(
            0,
            this.scale.scale.bandwidth() - this.getOffset() * 2,
          ) / 2;
        delta = this.scale.scale(<string>d) || 0;
        delta = delta + offs;
      } else {
        delta = this.scale.scale(<number>d) || 0;
      }
      if (this.type === DirectionType.Horizontal) {
        return `translate(${delta}, 0)`;
      } else {
        return `translate(0, ${delta})`;
      }
    }
    return "translate(0, 0)";
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
  private appendTick(
    selection: Selection<
      SVGGElement,
      string | number,
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
  private updateTick(
    selection: Selection<
      BaseType,
      string | number,
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
      string | number,
      SVGGElement,
      unknown
    >,
  ) {
    selection
      .append("ellipse")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("rx", this.tracked.tickWidth / 2)
      .attr("ry", this.tracked.tickHeight / 2);
  }

  /**
   * Update ellipse tick.
   */
  private updateEllipse(
    selection: Selection<
      BaseType,
      string | number,
      SVGGElement,
      unknown
    >,
  ): void {
    selection
      .select("ellipse")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("rx", this.tracked.tickWidth / 2)
      .attr("ry", this.tracked.tickHeight / 2);
  }

  /**
   * Append rect tick.
   */
  private appendRect(
    selection: Selection<
      SVGGElement,
      string | number,
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
      string | number,
      SVGGElement,
      unknown
    >,
  ) {
    selection
      .select("rect")
      .attr("x", 0 - this.tracked.tickWidth / 2)
      .attr("y", 0 - this.tracked.tickHeight / 2)
      .attr("width", this.tracked.tickWidth)
      .attr("height", this.tracked.tickHeight);
  }

  /**
   * Append text tick.
   */
  private appendText(
    selection: Selection<
      SVGGElement,
      string | number,
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
      .text((v) => v);
  }

  /**
   * Append text tick.
   */
  private updateText(
    selection: Selection<
      BaseType,
      string | number,
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
      .text((v) => v);
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
      this._tickStyle = null;
      this._events.add(type);
      this.requestUpdate("_force", true);
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
      this._tickStyle = null;
      this._events.delete(type);
      this.requestUpdate("_force", true);
    }
    super.removeEventListener(type, listener, options);
  }

  /**
   * Proxy the `event` of the `svg` element to the `hdml` element.
   */
  private proxyEvent = (event: Event, datum: number | string) => {
    let evt: TickEvent;
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
        evt.datum = datum;
        this.dispatchEvent(evt);
        break;
    }
  };
}

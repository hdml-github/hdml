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
 * Grid event.
 */
type GridEvent = (MouseEvent | PointerEvent | FocusEvent) & {
  datum?: number | string;
};

/**
 * The abstract class with the logic that is required to visualize the
 * grid.
 */
// eslint-disable-next-line max-len
export abstract class AbstractAxisGridElement extends AbstractDirectionElement {
  private _events: Set<string> = new Set();

  /**
   * @implements
   */
  protected get geometrySelector(): null | string {
    return (
      `:host > svg g.${this.dimension}-dimension#_${this.uid} ` +
      `path.grid`
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
      this._events.delete(type);
      this.requestUpdate("_force", true);
    }
    super.removeEventListener(type, listener, options);
  }

  /**
   * @implements
   */
  protected updateGeometry(): void {
    super.updateGeometry();
    if (this.selectedGroup) {
      this.selectedGroup
        .selectAll(".grid")
        .data<number | string>(this.getData())
        .order()
        .join(
          this.enterGrid.bind(this),
          this.updateGrid.bind(this),
          this.exitGrid.bind(this),
        );
    }
  }

  /**
   * Renders new grid.
   */
  private enterGrid(
    enter: Selection<
      EnterElement,
      string | number,
      SVGGElement,
      unknown
    >,
  ): Selection<
    SVGPathElement,
    string | number,
    SVGGElement,
    unknown
  > {
    return enter
      .append("path")
      .attr("class", "grid")
      .attr("tabindex", "-1")
      .attr("transform", this.getTransform.bind(this))
      .attr("d", this.getPathD())
      .call((selection) => {
        this._events.forEach((type) => {
          selection.on(type, this.proxyEvent.bind(this));
        });
      });
  }

  /**
   * Updates existing grid.
   */
  private updateGrid(
    update: Selection<
      BaseType,
      string | number,
      SVGGElement,
      unknown
    >,
  ): Selection<BaseType, string | number, SVGGElement, unknown> {
    return update
      .attr("transform", this.getTransform.bind(this))
      .attr("d", this.getPathD())
      .call((selection) => {
        this._events.forEach((type) => {
          selection.on(type, null);
        });
        this._events.forEach((type) => {
          selection.on(type, this.proxyEvent.bind(this));
        });
      });
  }

  /**
   * Removes grid that are related with the removed data.
   */
  private exitGrid(
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
   * Returns grid path `d` property value.
   */
  private getPathD(): string {
    if (this.isConnected && this.scale && this.scale.scale) {
      const d =
        this.type === DirectionType.Horizontal
          ? `M0,0V${this.tracked.height}`
          : `M0,0H${this.tracked.width}`;
      return d;
    }
    return "M0,0";
  }

  /**
   * Returns grid traslate propperty.
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
      : 0;
  }

  /**
   * Returns grid data array.
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
   * Proxy the `event` of the `svg` element to the `hdml` element.
   */
  private proxyEvent = (event: Event, datum: number | string) => {
    let evt: GridEvent;
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

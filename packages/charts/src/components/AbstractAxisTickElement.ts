/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  type Selection,
  type EnterElement,
  type BaseType,
  select,
  selectAll,
} from "d3";
import { OrdinalScaleElement } from "./OrdinalScaleElement";
import { LinearScaleElement } from "./LinearScaleElement";
import {
  AbstractDirectionElement,
  DirectionType,
} from "./AbstractDirectionElement";

export type ScaleElement = OrdinalScaleElement | LinearScaleElement;

export type SelectedTicksGroupTicks = Selection<
  SVGGElement,
  string | number,
  SVGGElement,
  unknown
>;

export type SelectedTicksEllipseTicks = Selection<
  SVGEllipseElement,
  string | number,
  SVGGElement,
  unknown
>;

export type SelectedTicksRectTicks = Selection<
  SVGRectElement,
  string | number,
  SVGGElement,
  unknown
>;

export type SelectedTicksTextTicks = Selection<
  SVGTextElement,
  string | number,
  SVGGElement,
  unknown
>;

export type SelectedTicksItemTicks =
  | SelectedTicksEllipseTicks
  | SelectedTicksRectTicks
  | SelectedTicksTextTicks;

/**
 * The abstract class with the logic that is required to visualize the
 * ticks.
 */
// eslint-disable-next-line max-len
export abstract class AbstractAxisTickElement extends AbstractDirectionElement {
  private _tickStyle: null | "text" | "rect" | "ellipse" = null;

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
  public connectedCallback(): void {
    super.connectedCallback();
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
  protected firstUpdated(
    changedProperties: Map<PropertyKey, unknown>,
  ): void {
    super.firstUpdated(changedProperties);
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
      this.selectedGroup.selectAll("g.tick").remove();
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
          values = this.values;
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
    return exit.remove();
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
    const dx =
      this.type === DirectionType.Vertical
        ? this.tracked.lineWidth / 2
        : 0;
    const dy =
      this.type === DirectionType.Horizontal
        ? this.tracked.lineWidth / 2
        : 0;
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
      string | number,
      SVGGElement,
      unknown
    >,
  ): void {
    const dx =
      this.type === DirectionType.Vertical
        ? this.tracked.lineWidth / 2
        : 0;
    const dy =
      this.type === DirectionType.Horizontal
        ? this.tracked.lineWidth / 2
        : 0;
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
      string | number,
      SVGGElement,
      unknown
    >,
  ) {
    const dx =
      this.type === DirectionType.Vertical
        ? (this.tracked.lineWidth + this.tracked.tickWidth) / 2
        : this.tracked.tickWidth / 2;
    const dy =
      this.type === DirectionType.Horizontal
        ? (this.tracked.lineWidth + this.tracked.tickHeight) / 2
        : this.tracked.tickHeight / 2;
    selection
      .append("rect")
      .attr("x", 0 - dx)
      .attr("y", 0 - dy)
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
    const dx =
      this.type === DirectionType.Vertical
        ? (this.tracked.lineWidth + this.tracked.tickWidth) / 2
        : this.tracked.tickWidth / 2;
    const dy =
      this.type === DirectionType.Horizontal
        ? (this.tracked.lineWidth + this.tracked.tickHeight) / 2
        : this.tracked.tickHeight / 2;
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
   * Attaches event listeners to the associated `svg` element.
   */
  private attachListener(): void {
    // if (this.selection) {
    //   const element = <SVGGElement>(
    //     this.selection.selectChild("path.domain").node()
    //   );
    //   element.addEventListener("mouseenter", this.eventListener);
    //   element.addEventListener("mouseleave", this.eventListener);
    //   element.addEventListener("mousemove", this.eventListener);
    //   element.addEventListener("mouseover", this.eventListener);
    //   element.addEventListener("mouseout", this.eventListener);
    //   element.addEventListener("mousedown", this.eventListener);
    //   element.addEventListener("mouseup", this.eventListener);
    //   element.addEventListener("click", this.eventListener);
    //   element.addEventListener("focus", this.eventListener);
    //   element.addEventListener("blur", this.eventListener);
    // }
  }

  /**
   * Detaches event listeners to the associated `svg` element.
   */
  private detachListener(): void {
    // if (this.selection) {
    //   const el = <SVGGElement>(
    //     this.selection.selectChild("path.domain").node()
    //   );
    //   el.removeEventListener("mouseenter", this.eventListener);
    //   el.removeEventListener("mouseleave", this.eventListener);
    //   el.removeEventListener("mousemove", this.eventListener);
    //   el.removeEventListener("mouseover", this.eventListener);
    //   el.removeEventListener("mouseout", this.eventListener);
    //   el.removeEventListener("mousedown", this.eventListener);
    //   el.removeEventListener("mouseup", this.eventListener);
    //   el.removeEventListener("click", this.eventListener);
    //   el.removeEventListener("focus", this.eventListener);
    //   el.removeEventListener("blur", this.eventListener);
    // }
  }

  /**
   * The associated `svg` element event listener.
   */
  private eventListener = (evt: Event) => {
    switch (evt.type) {
      case "mouseenter":
        this.dispatchEvent(new MouseEvent(evt.type));
        break;
      case "mouseleave":
        this.dispatchEvent(new MouseEvent(evt.type));
        break;
      case "mousemove":
        this.dispatchEvent(new MouseEvent(evt.type));
        break;
      case "mouseover":
        this.dispatchEvent(new MouseEvent(evt.type));
        break;
      case "mouseout":
        this.dispatchEvent(new MouseEvent(evt.type));
        break;
      case "mousedown":
        this.dispatchEvent(new MouseEvent(evt.type));
        break;
      case "mouseup":
        this.dispatchEvent(new MouseEvent(evt.type));
        break;
      case "click":
        this.dispatchEvent(new PointerEvent(evt.type));
        break;
      case "focus":
        this.dispatchEvent(new FocusEvent(evt.type));
        break;
      case "blur":
        this.dispatchEvent(new FocusEvent(evt.type));
        break;
    }
  };
}

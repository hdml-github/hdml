/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { type Selection } from "d3";
import { OrdinalScaleElement } from "./OrdinalScaleElement";
import { LinearScaleElement } from "./LinearScaleElement";
import {
  AbstractDirection,
  DirectionType,
} from "./AbstractDirection";

export type ScaleElement = OrdinalScaleElement | LinearScaleElement;

export type SelectedTicksGroupTicks = Selection<
  SVGGElement,
  string | number,
  SVGGElement,
  unknown
>;

export type SelectedTicksItemTicks = SelectedTicksEllipseTicks;

export type SelectedTicksEllipseTicks = Selection<
  SVGEllipseElement,
  string | number,
  SVGGElement,
  unknown
>;

/**
 * The abstract class with the logic that is required to visualize the
 * ticks.
 */
abstract class AbstractAxisTickElement extends AbstractDirection {
  private _selectedTicksGroup: null | SelectedTicksGroupTicks = null;
  private _selectedTicksItem: null | SelectedTicksItemTicks = null;

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
   * `D3` selection of the ticks `<g>` element.
   */
  public get selectedTicksGroup(): null | SelectedTicksGroupTicks {
    return this._selectedTicksGroup;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    if (this.selectedTicksGroup) {
      this.renderGeometry();
    }
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    this.selectedTicksGroup?.remove();
    super.disconnectedCallback();
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
  protected renderGeometry(): void {
    super.renderGeometry();
    if (this.selectedGroup) {
      this._selectedTicksGroup = this.selectedGroup
        .selectAll(".tick")
        .data<number | string>(this.getData())
        .order()
        .enter()
        .append("g")
        .attr("class", "tick")
        .attr("tabindex", "-1")
        .attr("transform", this.getTransform.bind(this));
      this.updateTickStyle();
    }
  }

  /**
   * @implements
   */
  protected updateGeometry(): void {
    super.updateGeometry();
    if (this.selectedTicksGroup) {
      this.selectedTicksGroup.attr(
        "transform",
        this.getTransform.bind(this),
      );
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
        if (this.count) {
          values = this.scale.scale.domain().slice(0, this.count);
        } else {
          values = this.scale.scale.domain();
        }
      }
    }
    return values;
  }

  /**
   * Returns tick traslate propperty.
   */
  private getTransform(d: number | string): string {
    if (this.isConnected && this.scale && this.scale.scale) {
      let delta: number | undefined;
      if (this.scale instanceof OrdinalScaleElement) {
        const offs =
          Math.max(
            0,
            this.scale.scale.bandwidth() - this.getOffset() * 2,
          ) / 2;

        // TODO: For the Point Scale and Band Scale this branch
        // must be enabled.
        // if (scale.round()) offs = Math.round(offs);

        delta = this.scale.scale(<string>d) || 0;
        delta = delta + offs;
      } else {
        delta = this.scale.scale(<number>d) || 0;
      }
      if (this.type === DirectionType.Horizontal) {
        return `translate(${delta},0)`;
      } else {
        return `translate(0,${delta})`;
      }
    }
    return "translate(0,0)";
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
   * Updates tick style.
   */
  private updateTickStyle(): void {
    if (this.selectedTicksGroup) {
      if (this.tracked.tickStyle === "ellipse") {
        const dx =
          this.type === DirectionType.Vertical
            ? this.tracked.lineWidth / 2
            : 0;
        const dy =
          this.type === DirectionType.Horizontal
            ? this.tracked.lineWidth / 2
            : 0;
        this._selectedTicksItem = this.selectedTicksGroup
          .append("ellipse")
          .attr("cx", 0 - dx)
          .attr("cy", 0 - dy)
          .attr("rx", this.tracked.tickWidth)
          .attr("ry", this.tracked.tickHeight);
      }
    }

    // .attr("points", "-5,5 5,5 5,-5 -5,-5");
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
export { AbstractAxisTickElement };

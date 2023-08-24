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

export type SelectedPath = Selection<
  SVGPathElement,
  unknown,
  null,
  undefined
>;

/**
 * The abstract class, which encapsules the logic that is required to
 * visualize axis.
 */
export abstract class AbstractAxisElement extends AbstractDirection {
  private _selectedPath: null | SelectedPath = null;

  /**
   * @implements
   */
  protected get geometrySelector(): null | string {
    return (
      `:host > svg g.${this.dimension}-dimension#_${this.uid} ` +
      `path.axis`
    );
  }

  /**
   * `D3` selection of the `<path>` element.
   */
  public get selectedPath(): null | SelectedPath {
    return this._selectedPath;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    if (this.selectedPath) {
      this.renderGeometry();
    }
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    this.selectedPath?.remove();
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
    if (this.view?.svg && this.selectedGroup && !this.selectedPath) {
      this._selectedPath = this.selectedGroup
        .append("path")
        .attr("class", "axis")
        .attr("tabindex", "-1")
        .attr("d", this.getPathD());
    } else if (
      this.view?.svg &&
      this.selectedGroup &&
      this.selectedPath
    ) {
      this.selectedGroup.insert(() => {
        if (this.selectedPath) {
          return this.selectedPath.node();
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
    super.updateGeometry();
    if (this.selectedPath) {
      this.selectedPath.attr("d", this.getPathD());
    }
  }

  /**
   * Returns axis path `d` property value.
   */
  private getPathD(): string {
    if (this.isConnected && this.scale && this.scale.scale) {
      const offset =
        typeof window !== "undefined" && window.devicePixelRatio > 1
          ? 0
          : 0; // 0.5; TODO: why it was here?
      const range = this.scale.scale.range();
      const range0 = +range[0] + offset;
      const range1 = +range[range.length - 1] + offset;
      const d =
        this.type === DirectionType.Vertical
          ? `M${offset},${range0}V${range1}`
          : `M${range0},${offset}H${range1}`;
      return d;
    }
    return "M0,0";
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

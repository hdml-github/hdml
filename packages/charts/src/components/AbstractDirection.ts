/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { type Selection } from "d3";
import { AbstractChartElement } from "./AbstractChartElement";
import { Dimension } from "./AbstractScaleElement";
import { OrdinalScaleElement } from "./OrdinalScaleElement";
import { LinearScaleElement } from "./LinearScaleElement";

export type ScaleElement = OrdinalScaleElement | LinearScaleElement;

export type SelectedGroup = Selection<
  SVGGElement,
  unknown,
  null,
  undefined
>;

export enum DirectionType {
  Horizontal,
  Vertical,
}

export enum HorizontalPosition {
  Top = "top",
  Center = "center",
  Bottom = "bottom",
}

export enum VerticalPosition {
  Left = "left",
  Center = "center",
  Right = "right",
}

/**
 * The abstract class, which encapsules the logic that is required to
 * visualize vertical or horizontal things on the Cartesian plane.
 */
export abstract class AbstractDirection extends AbstractChartElement {
  private _selectedGroup: null | SelectedGroup = null;

  /**
   * Direction type.
   */
  public abstract get type(): DirectionType;

  /**
   * Direction `dimension`.
   */
  public abstract set dimension(val: Dimension);

  /**
   * Direction `dimension`.
   */
  public abstract get dimension(): Dimension;

  /**
   * Direction `position`.
   */
  public abstract set position(
    pos: HorizontalPosition | VerticalPosition,
  );

  /**
   * Direction `position`.
   */
  public abstract get position():
    | HorizontalPosition
    | VerticalPosition;

  /**
   * Direction scale.
   */
  public get scale(): null | ScaleElement {
    let cnt = 0;
    let parent: null | HTMLElement | ScaleElement =
      this.parentElement;
    while (parent && cnt <= 5) {
      if (
        (parent instanceof LinearScaleElement ||
          parent instanceof OrdinalScaleElement) &&
        parent.dimension === this.dimension
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
   * `D3` selection of the root `<g>` element.
   */
  public get selectedGroup(): null | SelectedGroup {
    return this._selectedGroup;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    if (this.scale) {
      this.scale.addEventListener(
        "updated",
        this.scaleUpdatedListener,
      );
    }
    if (this.selectedGroup) {
      this.renderGeometry();
    }
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    if (this.scale) {
      this.scale.removeEventListener(
        "updated",
        this.scaleUpdatedListener,
      );
    }
    this.selectedGroup?.remove();
    super.disconnectedCallback();
  }

  /**
   * @override
   */
  public render(): lit.TemplateResult<1> {
    return lit.html`
      <slot></slot>
    `;
  }

  /**
   * @override
   */
  public shouldUpdate(
    changedProperties: Map<string, unknown>,
  ): boolean {
    if (
      changedProperties.has("_force") ||
      changedProperties.has("dimension") ||
      changedProperties.has("position")
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
    const attrDimension = this.getAttribute("dimension");
    const attrPosition = this.getAttribute("position");
    const svalDimension = this.dimension;
    const svalPosition = this.position;
    if (attrDimension !== svalDimension) {
      this.setAttribute("dimension", svalDimension);
    }
    if (attrPosition !== svalPosition) {
      this.setAttribute("position", svalPosition);
    }
    super.firstUpdated(changedProperties);
  }

  /**
   * @implements
   */
  protected renderGeometry(): void {
    if (this.view?.svg && !this.selectedGroup) {
      this._selectedGroup = this.view.svg
        .append("g")
        .attr("id", `_${this.uid}`)
        .attr("class", `${this.dimension}-dimension`)
        .attr("transform", this.getTranslation());
    } else if (this.view?.svg && this.selectedGroup) {
      this.view.svg.insert(() => {
        if (this.selectedGroup) {
          return this.selectedGroup.node();
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
    if (this.selectedGroup) {
      this.selectedGroup.attr("transform", this.getTranslation());
    }
  }

  /**
   * Associated scale component `updated` event listeners.
   */
  private scaleUpdatedListener = () => {
    this.requestUpdate();
  };

  /**
   * Returns direction group `transform` property value.
   */
  private getTranslation(): string {
    let x = 0;
    let y = 0;
    if (this.isConnected && this.scale && this.scale.plane) {
      if (this.type === DirectionType.Horizontal) {
        x = 0;
        y =
          this.scale.plane.tracked.paddingTop +
          this.tracked.top +
          this.tracked.lineWidth / 2;
      } else if (this.type === DirectionType.Vertical) {
        x =
          this.scale.plane.tracked.paddingLeft +
          this.tracked.left +
          this.tracked.lineWidth / 2;
        y = 0;
      }
    }
    return `translate(${x}, ${y})`;
  }
}

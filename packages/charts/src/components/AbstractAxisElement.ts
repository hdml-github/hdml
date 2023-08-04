/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import {
  type Selection,
  axisBottom,
  axisTop,
  axisLeft,
  axisRight,
} from "d3";
import { AbstractChartElement } from "./AbstractChartElement";
import { AbstractScaleElement } from "./AbstractScaleElement";
import { OrdinalScaleElement } from "./OrdinalScaleElement";
import { LinearScaleElement } from "./LinearScaleElement";

export type ScaleElement = OrdinalScaleElement | LinearScaleElement;
export type GSelection = Selection<
  SVGGElement,
  unknown,
  null,
  undefined
>;
export enum AxisType {
  Horizontal,
  Vertical,
}

// eslint-disable-next-line max-len
export abstract class AbstractAxisElement extends AbstractChartElement {
  private _selection: null | GSelection = null;

  /**
   * Axis type getter.
   */
  public abstract get type(): AxisType;

  /**
   * Axis `direction` setter.
   */
  public abstract set direction(val: "x" | "y" | "z" | "i" | "j");

  /**
   * Axis `direction` getter.
   */
  public abstract get direction(): "x" | "y" | "z" | "i" | "j";

  /**
   * Axis `position` setter.
   */
  public abstract set position(
    val: "bottom" | "left" | "center" | "right" | "top",
  );

  /**
   * Axis `position` getter.
   */
  public abstract get position():
    | "bottom"
    | "left"
    | "center"
    | "right"
    | "top";

  /**
   * `D3` selection of the axis root `g` element.
   */
  public get selection(): null | GSelection {
    return this._selection;
  }

  /**
   * Associated scale element.
   */
  public get scale(): null | ScaleElement {
    const scaleElement =
      this.direction === "x"
        ? this.scaleX
        : this.direction === "y"
        ? this.scaleY
        : this.direction === "z"
        ? this.scaleZ
        : this.direction === "i"
        ? this.scaleI
        : this.scaleJ;
    return scaleElement as ScaleElement;
  }

  /**
   * Scale element for the `x` direction.
   */
  public get scaleX(): null | AbstractScaleElement {
    return this.getScaleElement("x");
  }

  /**
   * Scale element for the `y` direction.
   */
  public get scaleY(): null | AbstractScaleElement {
    return this.getScaleElement("y");
  }

  /**
   * Scale element for the `z` direction.
   */
  public get scaleZ(): null | AbstractScaleElement {
    return this.getScaleElement("z");
  }

  /**
   * Scale element for the `i` direction.
   */
  public get scaleI(): null | AbstractScaleElement {
    return this.getScaleElement("i");
  }

  /**
   * Scale element for the `j` direction.
   */
  public get scaleJ(): null | AbstractScaleElement {
    return this.getScaleElement("j");
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    if (this.scale) {
      this.scale.addEventListener(
        "styles-changed",
        this.scaleStylesChangedListener,
      );
    }
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    if (this.scale) {
      this.scale.removeEventListener(
        "styles-changed",
        this.scaleStylesChangedListener,
      );
    }
    this.detachListener();
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
  protected firstUpdated(
    changedProperties: Map<PropertyKey, unknown>,
  ): void {
    super.firstUpdated(changedProperties);
    const attrDirection = this.getAttribute("direction");
    const attrPosition = this.getAttribute("position");
    const svalDirection = this.direction;
    const svalPosition = this.position;
    if (attrDirection !== svalDirection) {
      this.setAttribute("direction", svalDirection);
    }
    if (attrPosition !== svalPosition) {
      this.setAttribute("position", svalPosition);
    }
    this.renderSvgElements();
  }

  /**
   * @override
   */
  protected updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    this.updateSvgStyles();
    this.updateSvgPosition();
    this.updateSvgAxis();
    this.dispatchEvent(
      new CustomEvent("styles-changed", {
        cancelable: false,
        composed: false,
        bubbles: false,
      }),
    );
  }

  /**
   * @override
   */
  protected trackedStylesChanged(): void {
    this.updateSvgStyles();
    this.updateSvgPosition();
    this.updateSvgAxis();
  }

  /**
   * @override
   */
  protected renderSvgElements(): void {
    if (!this._selection && this.view?.svg) {
      this._selection = this.view.svg
        .append("g")
        .attr("class", `${this.direction}-axis`);
      this.updateSvgStyles();
      this.updateSvgPosition();
      this.updateSvgAxis();
      this.attachListener();
    }
    super.renderSvgElements();
  }

  /**
   * @override
   */
  protected updateSvgStyles(): void {
    super.updateSvgStyles(
      `:host > svg g.${this.direction}-axis path.domain`,
    );
  }

  /**
   * Returns scale for the specified direction.
   */
  private getScaleElement(
    direction: "x" | "y" | "z" | "i" | "j",
  ): null | AbstractScaleElement {
    let cnt = 0;
    let parent: null | HTMLElement | AbstractScaleElement =
      this.parentElement;
    while (parent && cnt <= 5) {
      if (
        parent instanceof AbstractScaleElement &&
        parent.direction === direction
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
   * The associated `scale` element `styles-changed` event listeners.
   */
  private scaleStylesChangedListener = () => {
    this.updateSvgStyles();
    this.updateSvgPosition();
    this.updateSvgAxis();
  };

  /**
   * Updates `svg` elements position.
   */
  private updateSvgPosition(): void {
    if (
      this.selection &&
      this.scale &&
      this.scale.scale &&
      this.scale.plane
    ) {
      let x = 0;
      let y = 0;
      if (this.type === AxisType.Horizontal) {
        switch (this.position) {
          case "top":
            x = 0;
            y = this.scale.plane.tracked.paddingTop;
            break;
          case "center":
          case "bottom":
            x = 0;
            y =
              this.scale.plane.tracked.paddingTop +
              this.tracked.top +
              this.tracked.height;
            break;
        }
      } else if (this.type === AxisType.Vertical) {
        switch (this.position) {
          case "right":
          case "center":
            x =
              this.scale.plane.tracked.paddingLeft +
              this.tracked.left +
              this.tracked.width;
            y = 0;
            break;
          case "left":
            x = this.scale.plane.tracked.paddingLeft;
            y = 0;
            break;
        }
      }
      this.selection.attr("transform", `translate(${x}, ${y})`);
    }
  }

  /**
   * Updates `svg` axis elements.
   */
  private updateSvgAxis(): void {
    if (this.selection && this.scale && this.scale.scale) {
      let axisFn;
      if (this.type === AxisType.Horizontal) {
        switch (this.position) {
          case "top":
            axisFn = axisTop;
            break;
          case "center":
          case "bottom":
            axisFn = axisBottom;
            break;
        }
      } else if (this.type === AxisType.Vertical) {
        switch (this.position) {
          case "right":
            axisFn = axisRight;
            break;
          case "center":
          case "left":
            axisFn = axisLeft;
            break;
        }
      }
      this.selection
        .call(
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          axisFn(this.scale.scale).ticks(0).tickSize(0),
        )
        .selectChild("path.domain")
        .attr("tabindex", "-1");
    }
  }

  /**
   * Attaches event listeners to the associated `svg` element.
   */
  private attachListener(): void {
    if (this.selection) {
      const element = <SVGGElement>(
        this.selection.selectChild("path.domain").node()
      );
      element.addEventListener("mouseenter", this.eventListener);
      element.addEventListener("mouseleave", this.eventListener);
      element.addEventListener("mousemove", this.eventListener);
      element.addEventListener("mouseover", this.eventListener);
      element.addEventListener("mouseout", this.eventListener);
      element.addEventListener("mousedown", this.eventListener);
      element.addEventListener("mouseup", this.eventListener);
      element.addEventListener("click", this.eventListener);
      element.addEventListener("focus", this.eventListener);
      element.addEventListener("blur", this.eventListener);
    }
  }

  /**
   * Detaches event listeners to the associated `svg` element.
   */
  private detachListener(): void {
    if (this.selection) {
      const element = <SVGGElement>(
        this.selection.selectChild("path.domain").node()
      );
      element.removeEventListener("mouseenter", this.eventListener);
      element.removeEventListener("mouseleave", this.eventListener);
      element.removeEventListener("mousemove", this.eventListener);
      element.removeEventListener("mouseover", this.eventListener);
      element.removeEventListener("mouseout", this.eventListener);
      element.removeEventListener("mousedown", this.eventListener);
      element.removeEventListener("mouseup", this.eventListener);
      element.removeEventListener("click", this.eventListener);
      element.removeEventListener("focus", this.eventListener);
      element.removeEventListener("blur", this.eventListener);
    }
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

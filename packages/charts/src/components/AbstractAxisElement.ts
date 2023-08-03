/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { type Selection } from "d3";
import { BaseChartElement } from "./BaseChartElement";
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

export abstract class AbstractAxisElement extends BaseChartElement {
  /**
   * Associated scale element.
   */
  public abstract get scale(): null | ScaleElement;

  /**
   * `D3` selection of the axis root `g` element.
   */
  public abstract get selection(): null | GSelection;

  /**
   * The `direction` getter.
   */
  public abstract get direction(): "x" | "z" | "i" | "j";

  /**
   * Scale for `x` direction.
   */
  public get scaleX(): null | AbstractScaleElement {
    return this.getScale("x");
  }

  /**
   * Scale for `y` direction.
   */
  public get scaleY(): null | AbstractScaleElement {
    return this.getScale("y");
  }

  /**
   * Scale for `z` direction.
   */
  public get scaleZ(): null | AbstractScaleElement {
    return this.getScale("z");
  }

  /**
   * Scale for `i` direction.
   */
  public get scaleI(): null | AbstractScaleElement {
    return this.getScale("i");
  }

  /**
   * Scale for `j` direction.
   */
  public get scaleJ(): null | AbstractScaleElement {
    return this.getScale("j");
  }

  /**
   * Returns scale for the specified direction.
   */
  private getScale(
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

    super.disconnectedCallback();
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
   * @override
   */
  protected updateSvgStyles(): void {
    super.updateSvgStyles(
      `:host > svg g.${this.direction}-axis path.domain`,
    );
  }

  /**
   * Updates `svg` elements position.
   */
  protected abstract updateSvgPosition(): void;

  /**
   * Updates `svg` axis elements.
   */
  protected abstract updateSvgAxis(): void;

  /**
   * Attaches event listeners to the associated `svg` element.
   */
  protected attachListener(): void {
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
  protected detachListener(): void {
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

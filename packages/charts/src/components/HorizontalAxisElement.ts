/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { type Selection, axisBottom } from "d3";
import { BaseAxisElement } from "./BaseAxisElement";
import { OrdinalScaleElement } from "./OrdinalScaleElement";
import { LinearScaleElement } from "./LinearScaleElement";

type ScaleElement = OrdinalScaleElement | LinearScaleElement;
type SVGGSelection = Selection<SVGGElement, unknown, null, undefined>;

export class HorizontalAxisElement extends BaseAxisElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
    :host {
      display: block;
      position: absolute;
      box-sizing: border-box;
      width: 100%;
      height: 0;
      border: 1px solid black;
      cursor: pointer;
    }
    :host([position=top]) {
      top: 0;
    }
    :host([position=center]) {
      top: 50%;
    }
    :host([position=bottom]) {
      bottom: 0;
    }
  `;

  /**
   * Reactive attributes.
   */
  public static properties = {
    /**
     * The `direction` property definition.
     */
    direction: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
      converter: {
        fromAttribute: (value: string): "x" | "z" | "i" | "j" => {
          if (!value) {
            return "x";
          } else {
            if (
              value === "x" ||
              value === "z" ||
              value === "i" ||
              value === "j"
            ) {
              return value;
            } else {
              return "x";
            }
          }
        },
        toAttribute: (value: string): string => {
          return value;
        },
      },
    },

    /**
     * The `position` property definition.
     */
    position: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
      converter: {
        fromAttribute: (
          value: string,
        ): "bottom" | "center" | "top" => {
          if (!value) {
            return "bottom";
          } else {
            if (
              value === "bottom" ||
              value === "center" ||
              value === "top"
            ) {
              return value;
            } else {
              return "bottom";
            }
          }
        },
        toAttribute: (value: string): string => {
          return value;
        },
      },
    },
  };

  private _direction: "x" | "z" | "i" | "j" = "x";
  private _position: "bottom" | "center" | "top" = "bottom";
  private _svgGSelection: null | SVGGSelection = null;

  /**
   * Associated scale element.
   */
  public get scale(): null | ScaleElement {
    const scaleElement =
      this.direction === "x"
        ? (this.scaleX as
            | null
            | OrdinalScaleElement
            | LinearScaleElement)
        : this.direction === "z"
        ? (this.scaleZ as
            | null
            | OrdinalScaleElement
            | LinearScaleElement)
        : this.direction === "i"
        ? (this.scaleI as
            | null
            | OrdinalScaleElement
            | LinearScaleElement)
        : (this.scaleJ as
            | null
            | OrdinalScaleElement
            | LinearScaleElement);
    return scaleElement;
  }

  /**
   * `D3` selection of the root `svg:g` element of the component.
   */
  public get svgGSelection(): null | SVGGSelection {
    return this._svgGSelection;
  }

  /**
   * The `direction` setter.
   */
  public set direction(val: "x" | "z" | "i" | "j") {
    const attr = this.getAttribute("direction");
    const sval = val;
    if (attr !== sval) {
      this.setAttribute("direction", sval);
    }
    const old = this._direction;
    this._direction = val;
    this.requestUpdate("direction", old);
  }

  /**
   * The `direction` getter.
   */
  public get direction(): "x" | "z" | "i" | "j" {
    return this._direction;
  }

  /**
   * The `position` setter.
   */
  public set position(val: "bottom" | "center" | "top") {
    const attr = this.getAttribute("position");
    const sval = val;
    if (attr !== sval) {
      this.setAttribute("position", sval);
    }
    const old = this._position;
    this._position = val;
    this.requestUpdate("position", old);
  }

  /**
   * The `position` getter.
   */
  public get position(): "bottom" | "center" | "top" {
    return this._position;
  }

  /**
   * @override
   */
  public render(): lit.TemplateResult<1> {
    return lit.html`<slot></slot>`;
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    this.detachListener();
    this._svgGSelection?.remove();
    this._svgGSelection = null;
    super.disconnectedCallback();
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
    this.updateSvgScale();
  }

  /**
   * @override
   */
  protected trackedStylesChanged(): void {
    this.updateSvgStyles();
    this.updateSvgPosition();
    this.updateSvgScale();
  }

  private renderSvgElements(): void {
    this.updateSvgStyles();
    if (!this._svgGSelection && this.view?.svg) {
      this._svgGSelection = this.view.svg
        .append("g")
        .attr("class", `${this.direction}-axis`);
      this.updateSvgPosition();
      this.updateSvgScale();
      this.attachListener();
    }
  }

  /**
   * @override
   */
  protected updateSvgStyles(): void {
    super.updateSvgStyles(
      `:host > svg g.${this.direction}-axis path.domain`,
    );
  }

  private updateSvgPosition(): void {
    if (
      this.svgGSelection &&
      this.scale &&
      this.scale.scale &&
      this.scale.plane
    ) {
      let position = 0;
      switch (this.position) {
        case "top":
          position = this.scale.plane.tracked.paddingTop;
          break;
        case "center":
        case "bottom":
          position =
            this.scale.plane.tracked.paddingTop +
            this.tracked.top +
            this.tracked.height;
          break;
      }
      this.svgGSelection.attr(
        "transform",
        `translate(0, ${position})`,
      );
    }
  }

  private updateSvgScale(): void {
    if (this.svgGSelection && this.scale && this.scale.scale) {
      this.svgGSelection
        .call(
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          axisBottom(this.scale.scale).ticks(0).tickSize(0),
        )
        .selectChild("path.domain")
        .attr("tabindex", "-1");
    }
  }

  private attachListener(): void {
    if (this.svgGSelection) {
      const element = <SVGGElement>(
        this.svgGSelection.selectChild("path.domain").node()
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
    }
  }

  private detachListener(): void {
    if (this.svgGSelection) {
      const element = <SVGGElement>(
        this.svgGSelection.selectChild("path.domain").node()
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
    }
  }

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
    }
  };
}

customElements.define("horizontal-axis", HorizontalAxisElement);

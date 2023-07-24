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
  }
  :host([position=top]) {
    top: 0;
  }
  :host([position=center]) {
    top: 50%;
  }
  :host([position=bottom]) {
    bottom: 0;
  }`;

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
  private _element: null | Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  > = null;
  private _stylesheet: CSSStyleSheet = new CSSStyleSheet();

  /**
   * `D3` selection of the root `svg:g` element of the component.
   */
  public get g(): null | Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  > {
    return this._element;
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
  protected firstUpdated(
    changedProperties: Map<PropertyKey, unknown>,
  ): void {
    super.firstUpdated(changedProperties);
    this.syncAttrs();
    this.patchAxis();
  }

  /**
   * @override
   */
  public updated(changed: Map<string, unknown>): void {
    if (changed.has("direction") || changed.has("position")) {
      this.patchAxis();
    }
  }

  /**
   * @override
   */
  protected trackedStylesChanged(): void {
    this.patchAxis();
  }

  private syncAttrs(): void {
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
  }

  private patchAxis(): void {
    const g = this.getGElement();
    const scale = this.getScaleElement();
    if (g && scale && scale.scale) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this._stylesheet.replace(this.getStyles());
      g.attr("transform", `translate(0, ${this.getPosition()})`).call(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        axisBottom(scale.scale).ticks(0).tickSize(0),
      );
    }
  }

  private getGElement(): null | Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  > {
    this.addGElement();
    return this._element;
  }

  private addGElement(): void {
    if (!this._element && this.view?.svg) {
      this.view.addStyleSheet(this.uid, this._stylesheet);
      this._stylesheet.insertRule(this.getStyles());
      this._element = this.view.svg
        .append("g")
        .attr("class", `${this.direction}-axis`);
      const el = this._element.node();
      if (el) {
        el.addEventListener("mouseenter", this.mouseoverListener);
        el.addEventListener("mouseover", this.mouseoverListener);
        el.addEventListener("mousemove", this.mouseoverListener);
        el.addEventListener("mousedown", this.mousedownListener);
        el.addEventListener("mouseup", this.mouseupListener);
        el.addEventListener("mouseleave", this.mouseoutListener);
        el.addEventListener("mouseout", this.mouseoutListener);
      }
    }
  }

  private removeGElement(): void {
    if (this._element) {
      this.view?.removeStyleSheet(this.uid);
      const el = this._element.node();
      if (el) {
        el.addEventListener("mouseenter", this.mouseoverListener);
        el.addEventListener("mouseover", this.mouseoverListener);
        el.addEventListener("mousemove", this.mouseoverListener);
        el.addEventListener("mousedown", this.mousedownListener);
        el.addEventListener("mouseup", this.mouseupListener);
        el.addEventListener("mouseleave", this.mouseoutListener);
        el.addEventListener("mouseout", this.mouseoutListener);
      }
      this._element.remove();
      this._element = null;
    }
  }

  private mouseoverListener = () => {
    this.classList.add("hover");
  };

  private mousedownListener = () => {
    this.classList.add("active");
  };

  private mouseupListener = () => {
    this.classList.remove("active");
  };

  private mouseoutListener = () => {
    this.classList.remove("hover");
    this.classList.remove("active");
  };

  private getScaleElement():
    | null
    | OrdinalScaleElement
    | LinearScaleElement {
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

  private getPosition(): number {
    const scale = this.getScaleElement();
    const plane = scale?.plane;
    if (plane && scale) {
      switch (this.position) {
        case "top":
          return plane.tracked.paddingTop;
        case "center":
        case "bottom":
          return (
            plane.tracked.paddingTop +
            this.tracked.top +
            this.tracked.height
          );
      }
    }
    return 0;
  }

  private getStyles(): string {
    let css = "";
    if (
      !this.classList.contains("hover") &&
      !this.classList.contains("active")
    ) {
      css = `:host>svg g.${this.direction}-axis path.domain {`;
    } else if (
      this.classList.contains("hover") &&
      !this.classList.contains("active")
    ) {
      css = `:host>svg g.${this.direction}-axis path.domain:hover {`;
    } else if (
      !this.classList.contains("hover") &&
      this.classList.contains("active")
    ) {
      css = `:host>svg g.${this.direction}-axis path.domain:active {`;
    } else {
      css = `:host>svg g.${this.direction}-axis path.domain:active {`;
    }
    if (this.tracked.borderStyle === "solid") {
      css =
        css +
        `stroke: ${this.tracked.borderColor};\n` +
        `stroke-width: ${this.tracked.borderWidth};\n`;
    } else if (this.tracked.borderStyle === "dashed") {
      css =
        css +
        `stroke: ${this.tracked.borderColor};\n` +
        `stroke-width: ${this.tracked.borderWidth};\n` +
        `stroke-dasharray: ${2 * this.tracked.borderWidth + 1},` +
        `${this.tracked.borderWidth + 1}\n`;
    } else if (this.tracked.borderStyle === "dotted") {
      css =
        css +
        `stroke: ${this.tracked.borderColor};\n` +
        `stroke-width: ${this.tracked.borderWidth};\n` +
        `stroke-dasharray: 1,` +
        `${2 * this.tracked.borderWidth};\n` +
        "stroke-linecap: round;\n";
    } else {
      css = css + `stroke: rgba(0, 0, 0, 0);\nstroke-width: 0;\n`;
    }
    css = css + "}";
    return css;
  }
}

customElements.define("horizontal-axis", HorizontalAxisElement);

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

    const attrDirection = this.getAttribute("direction");
    const svalDirection = this.direction;
    if (attrDirection !== svalDirection) {
      this.setAttribute("direction", svalDirection);
    }

    const attrPosition = this.getAttribute("position");
    const svalPosition = this.position;
    if (attrPosition !== svalPosition) {
      this.setAttribute("position", svalPosition);
    }

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

  private patchAxis(): void {
    const view = this.view;
    const g = this.getGElement();
    const scale = this.getScaleElement();
    if (view && g && scale && scale.scale) {
      view.patchShadowStyles(this.getStyles());
      g.attr("transform", `translate(0, ${this.getPosition()})`).call(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        axisBottom(scale.scale).ticks(0).tickSize(0),
      );
    }
  }

  private getGElement(): Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  > | null {
    const svg = this.view?.svg;
    if (!svg) {
      this._element && this._element.remove();
    } else {
      if (!this._element) {
        svg.append("g").attr("class", `${this.direction}-axis`);
        this._element = svg.select(`g.${this.direction}-axis`);
      }
    }
    return this._element;
  }

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
    let css = `:host > svg g.${this.direction}-axis path.domain {`;
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

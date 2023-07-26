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
      this.setSvgStyles();
      g.attr("transform", `translate(0, ${this.getPosition()})`)
        .call(
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          axisBottom(scale.scale).ticks(0).tickSize(0),
        )
        .selectChild("path.domain");
      //.attr("tabindex", "-1");
      // TODO: do we need it to be focusable?
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
      this.setSvgStyles();
      this._element = this.view.svg
        .append("g")
        .attr("class", `${this.direction}-axis`);
    }
  }

  private removeGElement(): void {
    if (this._element) {
      this.view?.removeStyleSheet(this.uid);
      this._element.remove();
      this._element = null;
    }
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

  private setSvgStyles(): void {
    const [def, hov, foc, act] = this.getStyles();
    for (let i = this._stylesheet.cssRules.length - 1; i >= 0; i--) {
      this._stylesheet.deleteRule(i);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this._stylesheet.insertRule(act);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this._stylesheet.insertRule(foc);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this._stylesheet.insertRule(hov);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this._stylesheet.insertRule(def);
  }

  private getStyles(): string[] {
    const def = this.getDefaultStyles();
    const hov = this.getHoverStyles();
    const foc = this.getFocusStyles();
    const act = this.getActiveStyles();
    return [def, hov, foc, act];
  }

  private getDefaultStyles(): string {
    let css = `:host > svg g.${this.direction}-axis path.domain { `;
    css = css + this.getStyleProperties();
    css = css + " }";
    return css;
  }

  private getHoverStyles(): string {
    this.classList.add("hover");
    let css =
      `:host > svg g.${this.direction}-axis ` +
      "path.domain:hover { ";
    css = css + this.getStyleProperties();
    css = css + " }";
    this.classList.remove("hover");
    return css;
  }

  private getFocusStyles(): string {
    this.classList.add("focus");
    let css =
      `:host > svg g.${this.direction}-axis ` +
      "path.domain:focus { ";
    css = css + this.getStyleProperties();
    css = css + " }";
    this.classList.remove("focus");
    return css;
  }

  private getActiveStyles(): string {
    this.classList.add("active");
    let css =
      `:host > svg g.${this.direction}-axis ` +
      "path.domain:active { ";
    css = css + this.getStyleProperties();
    css = css + " }";
    this.classList.remove("active");
    return css;
  }

  private getStyleProperties(): string {
    let css = "";
    if (this.tracked.borderStyle === "solid") {
      css =
        css +
        `stroke: ${this.tracked.borderColor}; ` +
        `stroke-width: ${this.tracked.borderWidth}; ` +
        `cursor: ${this.tracked.cursor}; `;
    } else if (this.tracked.borderStyle === "dashed") {
      css =
        css +
        `stroke: ${this.tracked.borderColor}; ` +
        `stroke-width: ${this.tracked.borderWidth}; ` +
        `stroke-dasharray: ${2 * this.tracked.borderWidth + 1},` +
        `${this.tracked.borderWidth + 1}; ` +
        `cursor: ${this.tracked.cursor}; `;
    } else if (this.tracked.borderStyle === "dotted") {
      css =
        css +
        `stroke: ${this.tracked.borderColor}; ` +
        `stroke-width: ${this.tracked.borderWidth}; ` +
        `stroke-dasharray: 1,` +
        `${2 * this.tracked.borderWidth};` +
        "stroke-linecap: round; " +
        `cursor: ${this.tracked.cursor}; `;
    } else {
      css =
        css +
        `stroke: rgba(0, 0, 0, 0); stroke-width: 0; ` +
        `cursor: ${this.tracked.cursor}; `;
    }
    css = css + "outline: none;";
    return css;
  }
}

customElements.define("horizontal-axis", HorizontalAxisElement);

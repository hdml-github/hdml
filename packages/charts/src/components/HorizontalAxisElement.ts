/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { axisBottom } from "d3";
import {
  AbstractAxisElement,
  GSelection,
  ScaleElement,
} from "./AbstractAxisElement";

export class HorizontalAxisElement extends AbstractAxisElement {
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
  private _svgGSelection: null | GSelection = null;

  /**
   * @override
   */
  public get scale(): null | ScaleElement {
    const scaleElement =
      this.direction === "x"
        ? this.scaleX
        : this.direction === "z"
        ? this.scaleZ
        : this.direction === "i"
        ? this.scaleI
        : this.scaleJ;
    return scaleElement as ScaleElement;
  }

  /**
   * @override
   */
  public get selection(): null | GSelection {
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
   * @override
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
    return lit.html`
      <slot></slot>
    `;
  }

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
    this.updateSvgAxis();
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
    if (!this._svgGSelection && this.view?.svg) {
      this._svgGSelection = this.view.svg
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
  protected updateSvgPosition(): void {
    if (
      this.selection &&
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
      this.selection.attr("transform", `translate(0, ${position})`);
    }
  }

  /**
   * @override
   */
  protected updateSvgAxis(): void {
    if (this.selection && this.scale && this.scale.scale) {
      this.selection
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
}

customElements.define("horizontal-axis", HorizontalAxisElement);

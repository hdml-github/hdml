/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { type Selection, select } from "d3";
import { BaseUnifiedElement } from "./BaseUnifiedElement";

export class HdmlViewElement extends BaseUnifiedElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
  :host {
    display: inline-block;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
  :host > slot {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    visibility: collapse;
  }
  :host > svg {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }`;

  private _svg: null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  > = null;

  /**
   * `D3` selection of the component's `svg:svg` element.
   */
  get svg(): null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  > {
    return this._svg;
  }

  /**
   * Renders compomponent `DOM`.
   */
  public render(): lit.TemplateResult<1> {
    return lit.html`
      <slot></slot>
      <svg></svg>
    `;
  }

  /**
   * Initialization callback.
   */
  public firstUpdated(): void {
    this._svg = select(this.renderRoot.querySelector("svg"));
    this._svg.attr("viewBox", [
      0,
      0,
      parseFloat(this.styles.width),
      parseFloat(this.styles.height),
    ]);
  }
}
customElements.define("hdml-view", HdmlViewElement);

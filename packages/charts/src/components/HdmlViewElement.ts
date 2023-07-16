/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit, UnifiedElement } from "@hdml/elements";
import * as d3 from "d3";

export class HdmlViewElement extends UnifiedElement {
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

  private _root: null | d3.Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  > = null;

  private _compStyle = window.getComputedStyle(this);

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
  }

  /**
   * @override
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
    this._root = d3.select(this.renderRoot.querySelector("svg"));
    this._root.attr("viewBox", [
      0,
      0,
      parseFloat(this._compStyle.width),
      parseFloat(this._compStyle.height),
    ]);
    this._root
      .append("g")
      .attr("fill", "steelblue")
      .selectAll()
      .data([0, 1, 2, 3, 4])
      .join("rect")
      .attr("x", (d) => d)
      .attr("y", 0)
      .attr("height", 10)
      .attr("width", 10);
  }
}
customElements.define("hdml-view", HdmlViewElement);

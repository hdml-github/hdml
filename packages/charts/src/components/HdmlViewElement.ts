/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { type Selection, select } from "d3";
import { AbstractChartElement } from "./AbstractChartElement";

export class HdmlViewElement extends AbstractChartElement {
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
    }
    text {
      color: rgba(0, 0, 0, 0);
      cursor: pointer;
      stroke-width: 0 !important;
      stroke-dasharray: none !important;
      stroke: rgba(0, 0, 0, 0) !important;
    }
    text::selection {
      background-color: rgba(0, 0, 0, 0);
    }
  `;

  private _svg: null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  > = null;
  private _stylesheets: Set<CSSStyleSheet> = new Set();

  /**
   * @implements
   */
  protected get geometrySelector(): null | string {
    return "svg";
  }

  /**
   * `D3` selection of the `svg:svg` element of the component.
   */
  public get svg(): null | Selection<
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
      <svg><g><text>Text</text></g></svg>
    `;
  }

  /**
   * @implements
   */
  protected renderGeometry(): void {
    this._svg = select(this.renderRoot.querySelector("svg"));
  }

  /**
   * @implements
   */
  protected updateGeometry(): void {
    if (this.isConnected && this._svg) {
      this._svg.attr("viewBox", [
        0,
        0,
        this.tracked.width,
        this.tracked.height,
      ]);
    }
  }

  /**
   * Adds `CSSStyleSheet` object to the `hdml-view` shadow `DOM`. Do
   * nothing if specified stylesheet was already added.
   *
   * @category comp-styles
   */
  public addStylesheet(stylesheet: CSSStyleSheet): void {
    if (!this._stylesheets.has(stylesheet)) {
      this._stylesheets.add(stylesheet);
      this.resetStylesheets(Array.from(this._stylesheets.values()));
    }
  }

  /**
   * Removes `CSSStyleSheet` object from the `hdml-view` shadow `DOM`.
   *
   * @category comp-styles
   */
  public removeStylesheet(stylesheet: CSSStyleSheet): void {
    if (this._stylesheets.has(stylesheet)) {
      this._stylesheets.delete(stylesheet);
      this.resetStylesheets(Array.from(this._stylesheets.values()));
    }
  }
}

customElements.define("hdml-view", HdmlViewElement);

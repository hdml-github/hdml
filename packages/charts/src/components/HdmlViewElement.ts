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
   * `D3` selection of the `svg:svg` element of the component.
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
    this.patchSvg();
  }

  /**
   * @override
   */
  public trackedStylesChanged(): void {
    this.patchSvg();
  }

  /**
   * Updates `svg` element attributes.
   */
  private patchSvg(): void {
    if (this._svg) {
      this._svg.attr("viewBox", [
        0,
        0,
        this.tracked.width,
        this.tracked.height,
      ]);
    }
  }

  /**
   * Adds `CSSStyleSheet` object to the `hdml-view` shadow `DOM`.
   *
   * @category comp-styles
   */
  public addStylesheet(stylesheet: CSSStyleSheet): void {
    if (!this._stylesheets.has(stylesheet)) {
      this._stylesheets.add(stylesheet);
      this.resetShadowStylesheets(
        Array.from(this._stylesheets.values()),
      );
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
      this.resetShadowStylesheets(
        Array.from(this._stylesheets.values()),
      );
    }
  }
}

customElements.define("hdml-view", HdmlViewElement);

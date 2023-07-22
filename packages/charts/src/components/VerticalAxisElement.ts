/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { BaseChartElement } from "./BaseChartElement";

export class VerticalAxisElement extends BaseChartElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
  :host {
    display: block;
    position: absolute;
    box-sizing: border-box;
    width: 0;
    height: 100%;
    border: 1px solid black;
  }
  :host([position=left]) {
    left: 0;
  }
  :host([position=center]) {
    left: 50%;
  }
  :host([position=right]) {
    right: 0;
  }`;

  public render(): lit.TemplateResult<1> {
    return lit.html`<slot></slot>`;
  }
}
customElements.define("vertical-axis", VerticalAxisElement);

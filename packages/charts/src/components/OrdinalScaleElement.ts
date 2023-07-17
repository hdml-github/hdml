/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { BaseScaleElement } from "./BaseScaleElement";

export class OrdinalScaleElement extends BaseScaleElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
  :host,
  :host > slot {
    display: block;
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }`;

  public render(): lit.TemplateResult<1> {
    return lit.html`<slot></slot>`;
  }
}
customElements.define("ordinal-scale", OrdinalScaleElement);

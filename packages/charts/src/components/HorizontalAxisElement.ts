/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit, UnifiedElement } from "@hdml/elements";

export class HorizontalAxisElement extends UnifiedElement {
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
  :host([anchor=top]) {
    top: 0;
  }
  :host([anchor=center]) {
    top: 50%;
  }
  :host([anchor=bottom]) {
    bottom: 0;
  }`;

  public render(): lit.TemplateResult<1> {
    return lit.html`<slot></slot>`;
  }
}
customElements.define("horizontal-axis", HorizontalAxisElement);

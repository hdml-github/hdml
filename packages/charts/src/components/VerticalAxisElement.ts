/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit, UnifiedElement } from "@hdml/elements";

export class VerticalAxisElement extends UnifiedElement {
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
  :host([anchor=left]) {
    left: 0;
  }
  :host([anchor=center]) {
    left: 50%;
  }
  :host([anchor=right]) {
    right: 0;
  }`;

  public render(): lit.TemplateResult<1> {
    return lit.html`<slot></slot>`;
  }
}
customElements.define("vertical-axis", VerticalAxisElement);

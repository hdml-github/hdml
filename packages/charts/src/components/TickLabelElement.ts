/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit, UnifiedElement } from "@hdml/elements";

export class TickLabelElement extends UnifiedElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
  :host {
    display: block;
    position: absolute;
    box-sizing: border-box;
  }
  :host-context(horizontal-axis[anchor=top]) {
    bottom: 5px;
  }
  :host-context(horizontal-axis[anchor=center]),
  :host-context(horizontal-axis[anchor=bottom]) {
    top: 5px;
  }
  :host-context(vertical-axis[anchor=left]),
  :host-context(vertical-axis[anchor=center]) {
    right: 5px;
  }
  :host-context(vertical-axis[anchor=right]) {
    left: 5px;
  }`;

  public render(): lit.TemplateResult<1> {
    return lit.html`<slot></slot>`;
  }
}
customElements.define("tick-label", TickLabelElement);

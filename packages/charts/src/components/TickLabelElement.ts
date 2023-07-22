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
  :host-context(horizontal-axis[position=top]) {
    bottom: 5px;
  }
  :host-context(horizontal-axis[position=center]),
  :host-context(horizontal-axis[position=bottom]) {
    top: 5px;
  }
  :host-context(vertical-axis[position=left]),
  :host-context(vertical-axis[position=center]) {
    right: 5px;
  }
  :host-context(vertical-axis[position=right]) {
    left: 5px;
  }`;

  public render(): lit.TemplateResult<1> {
    return lit.html`<slot></slot>`;
  }
}
customElements.define("tick-label", TickLabelElement);

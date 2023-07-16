/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit, UnifiedElement } from "@hdml/elements";

export class AxisTickElement extends UnifiedElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
  :host {
    display: block;
    position: absolute;
    box-sizing: border-box;
    border: 1px solid black;
  }
  :host > slot {
    display: flex;
    align-items: center;
  }
  :host-context(horizontal-axis) {
    width: 1px;
    height: 5px;
    left: 50%;
  }
  :host-context(vertical-axis) {
    width: 5px;
    height: 1px;
    right: 0;
    top: 50%;
  }
  :host-context(horizontal-axis[anchor=top]) {
    bottom: 0;
  }
  :host-context(horizontal-axis[anchor=center]),
  :host-context(horizontal-axis[anchor=bottom]) {
    top: 0;
  }
  :host-context(vertical-axis[anchor=left]),
  :host-context(vertical-axis[anchor=center]) {
    right: 0;
  }
  :host-context(vertical-axis[anchor=right]) {
    left: 0;
  }
  :host-context(horizontal-axis) > slot {
    flex-direction: column;
  }
  :host-context(vertical-axis) > slot {
    flex-direction: row;
  }`;

  public render(): lit.TemplateResult<1> {
    return lit.html`<slot></slot>`;
  }
}
customElements.define("axis-tick", AxisTickElement);

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit, UnifiedElement } from "@hdml/elements";

export class AxisGridElement extends UnifiedElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
  :host {
    display: block;
    position: absolute;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, .2);
  }
  :host-context(horizontal-axis) {
    width: 1px;
    height: 15px;
    left: 50%;
  }
  :host-context(vertical-axis) {
    width: 15px;
    height: 1px;
    top: 50%;
  }
  :host-context(horizontal-axis[anchor=top]) {
    top: 0;
  }
  :host-context(horizontal-axis[anchor=center]),
  :host-context(horizontal-axis[anchor=bottom]) {
    bottom: 0;
  }
  :host-context(vertical-axis[anchor=left]),
  :host-context(vertical-axis[anchor=center]) {
    left: 0;
  }
  :host-context(vertical-axis[anchor=right]) {
    right: 0;
  }`;
}
customElements.define("axis-grid", AxisGridElement);

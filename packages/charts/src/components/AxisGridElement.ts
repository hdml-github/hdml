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
  }
  :host-context(vertical-axis) {
    width: 15px;
    height: 1px;
  }
  :host-context(horizontal-axis[position=top]) {
    top: 0;
  }
  :host-context(horizontal-axis[position=center]),
  :host-context(horizontal-axis[position=bottom]) {
    bottom: 0;
  }
  :host-context(vertical-axis[position=left]),
  :host-context(vertical-axis[position=center]) {
    left: 0;
  }
  :host-context(vertical-axis[position=right]) {
    right: 0;
  }`;
}
customElements.define("axis-grid", AxisGridElement);

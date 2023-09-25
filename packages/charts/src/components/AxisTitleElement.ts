/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit, UnifiedElement } from "@hdml/elements";

export class AxisTitleElement extends UnifiedElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
  :host {
    display: flex;
    position: relative;
  }
  :host-context(horizontal-axis) {
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
    height: 0;
  }
  :host-context(vertical-axis) {
    flex-direction: column;
    align-items: flex-end;
    width: 0;
    height: 100%;
  }
  :host > slot {
    display: flex;
    white-space: nowrap;
  }
  :host-context(horizontal-axis) > slot {
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
  }
  :host-context(vertical-axis) > slot {
    flex-direction: row;
    align-items: flex-start;
    height: 100%;
  }`;

  public render(): lit.TemplateResult<1> {
    return lit.html`<slot></slot>`;
  }
}
customElements.define("axis-title", AxisTitleElement);

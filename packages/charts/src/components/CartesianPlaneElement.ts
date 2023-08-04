/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { AbstractPlaneElement } from "./AbstractPlaneElement";

export class CartesianPlaneElement extends AbstractPlaneElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
  :host {
    display: block;
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0;
    background: rgba(0, 0, 0, 0);
  }
  :host > div {
    display: block;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
  :host > div > slot {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
  }`;

  /**
   * Renders compomponent `DOM`.
   */
  public render(): lit.TemplateResult<1> {
    return lit.html`
      <div>
        <slot></slot>
      </div>
    `;
  }
}
customElements.define("cartesian-plane", CartesianPlaneElement);

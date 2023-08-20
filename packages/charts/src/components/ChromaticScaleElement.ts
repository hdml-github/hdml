/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { AbstractScaleElement } from "./AbstractScaleElement";

export class ChromaticScaleElement extends AbstractScaleElement {
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
    }
  `;

  /**
   * Reactive attributes.
   */
  public static properties = {
    /**
     * Private property to force updates.
     */
    _force: {
      type: Boolean,
      attribute: false,
      reflect: false,
      state: false,
    },
  };

  public render(): lit.TemplateResult<1> {
    return lit.html`
      <slot></slot>
    `;
  }

  /**
   * @override
   */
  public shouldUpdate(
    changedProperties: Map<string, unknown>,
  ): boolean {
    return super.shouldUpdate(changedProperties);
  }

  protected updateScale(): void {
    //
  }
}

customElements.define("chromatic-scale", ChromaticScaleElement);

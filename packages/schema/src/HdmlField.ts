import { html, TemplateResult, LitElement } from "lit";
import { Schema } from "@hdml/arrow";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/**
 * hdml Field component class.
 */
export default class hdmlField extends LitElement {
  /**
   * Class constructor.
   */
  constructor() {
    super();
  }

  /**
   * Render component.
   */
  render(): TemplateResult<1> {
    return html``;
  }
}
customElements.define("hdml-field", hdmlField);

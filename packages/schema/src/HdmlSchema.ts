import { html, TemplateResult, LitElement } from "lit";
import { Schema } from "@hdml/arrow";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/**
 * hdml Schema component class.
 */
export default class hdmlSchema extends LitElement {
  /**
   * Compiled schema object.
   */
  private _schema: Schema<any>;

  /**
   * Class constructor.
   */
  constructor() {
    super();
    this._schema = new Schema();
  }

  /**
   * Render component.
   */
  render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }
}
customElements.define("hdml-schema", hdmlSchema);

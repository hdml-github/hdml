import { html, TemplateResult, LitElement } from "lit";
import { Schema } from "@hdml/arrow";

/**
 * hdml Schema component class.
 */
export default class HdmlSchema extends LitElement {
  /**
   * Compiled schema object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
customElements.define("hdml-schema", HdmlSchema);

import { html, TemplateResult, LitElement } from "lit";

/**
 * HDML table component class.
 */
export default class HdmlTable extends LitElement {
  static properties = {
    id: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: false,
      state: false,
    },
    limit: {
      type: Number,
      attribute: true,
      reflect: true,
      noAccessor: false,
      state: false,
    },
  };

  /**
   * Maximum rows number.
   */
  public limit?: number;

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
    return html`<slot></slot>`;
  }
}
customElements.define("hdml-table", HdmlTable);

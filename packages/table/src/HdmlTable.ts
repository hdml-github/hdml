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

  private _limit?: number;

  set limit(val: undefined | number | string) {
    const oldVal = this._limit;
    this._limit = parseInt(val as unknown as string);
    this.requestUpdate("limit", oldVal);
  }

  get limit(): undefined | number {
    return this._limit;
  }

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

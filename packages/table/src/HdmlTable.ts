/**
 * @fileoverview HdmlTable class definition and <hdml-table> custom
 * element registration.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult, LitElement } from "lit";

/**
 * HDML table component class.
 */
export default class HdmlTable extends LitElement {
  public static properties = {
    id: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: false,
      state: false,
    },

    /**
     * Maximum rows number.
     */
    limit: {
      type: Number,
      attribute: true,
      reflect: true,
      noAccessor: false,
      state: false,
    },
  };

  private _limit?: number;

  public set limit(val: undefined | number | string) {
    const oldVal = this._limit;
    this._limit = parseInt(val as unknown as string);
    this.requestUpdate("limit", oldVal);
  }

  public get limit(): undefined | number {
    return this._limit;
  }

  /**
   * Class constructor.
   */
  constructor() {
    super();
  }

  /**
   * Component renderer.
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }
}
customElements.define("hdml-table", HdmlTable);

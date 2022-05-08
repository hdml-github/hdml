/**
 * @fileoverview HdmlTable class definition and <hdml-table> custom
 * element registration.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Errors } from "@hdml/messages";
import HdmlElement from "./HdmlElement";

/**
 * HDML table component class.
 */
export default class HdmlTable extends HdmlElement {
  /**
   * HDML table reactive properties.
   */
  public static properties = {
    /**
     * Table name.
     */
    name: {
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

  /**
   * Table name storage.
   */
  private _name?: string;

  /**
   * Table limit storage.
   */
  private _limit?: number;

  /**
   * Table name setter.
   */
  public set name(val: string) {
    if (typeof val !== "string") {
      throw new TypeError(Errors.TABLE_NAME_TYPE);
    }
    const old = this._name;
    this._name = val;
    this.requestUpdate("name", old);
  }

  /**
   * Table name getter.
   */
  public get name(): string {
    return this._name || "";
  }

  /**
   * Table limit setter.
   */
  public set limit(val: number) {
    if (typeof val !== "number") {
      throw new TypeError(Errors.TABLE_LIMIT_TYPE);
    }
    const old = this._limit;
    this._limit = val;
    this.requestUpdate("limit", old);
  }

  /**
   * Table limit getter.
   */
  public get limit(): number {
    return this._limit || 0;
  }

  /**
   * @override
   */
  public async connectedCallback(): Promise<void> {
    if (!this._name) {
      this.name = "default_table_name";
    }
    if (!this._limit && this._limit !== 0) {
      this.limit = 0;
    }
    await super.connectedCallback();
  }
}
customElements.define("hdml-table", HdmlTable);

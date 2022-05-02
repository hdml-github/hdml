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
  public static properties = {
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

  private _name = "";

  public set name(val: string) {
    if (typeof val !== "string") {
      throw new TypeError(Errors.TABLE_NAME_TYPE);
    }
    const oldVal = this._name;
    this._name = val;
    this.requestUpdate("name", oldVal);
  }

  public get name(): string {
    return this._name;
  }

  private _limit = 0;

  public set limit(val: number | string) {
    const oldVal = this._limit;
    this._limit = parseInt(val as unknown as string);
    this.requestUpdate("limit", oldVal);
  }

  public get limit(): number {
    return this._limit;
  }
}
customElements.define("hdml-table", HdmlTable);

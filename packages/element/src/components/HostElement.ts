/**
 * @fileoverview `HostElement` class definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { UnifiedElement } from "./UnifiedElement";

export const HOST_NAME_REGEXP =
  /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

/**
 *
 */
export class HostElement extends UnifiedElement {
  /**
   * Reactive attributes.
   */
  public static properties = {
    /**
     * A `name` property definition.
     */
    name: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },
  };

  /**
   * A `name` private property.
   */
  private _name = "";

  /**
   * A `name` setter.
   */
  public set name(val: string) {
    if (HOST_NAME_REGEXP.test(val)) {
      const old = this._name;
      this._name = val;
      this.requestUpdate("name", old);
    } else {
      console.error(
        `The \`name\` property value "${val}" doesn't match an ` +
          "element schema. Skipped.",
      );
      this.removeAttribute("name");
    }
  }

  /**
   * A `name` getter.
   */
  public get name(): string {
    return this._name;
  }
}

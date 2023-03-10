/**
 * @fileoverview The `HostElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { UnifiedElement } from "./UnifiedElement";

export const HOST_NAME_REGEXP =
  /^(?:[a-z])+[a-z0-9]*(?:[-_.][a-z0-9]+)*\.[a-z]{2,6}$/;

export const HOST_TENANT_REGEXP =
  /^(?:[a-z])+[a-z0-9-_]*(?:[-_][a-z0-9]+)*$/;

export const HOST_TOKEN_REGEXP = /^([a-zA-Z0-9_.\-+/=]*)$/;

/**
 * `HostElement` class.
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

    /**
     * A `tenant` property definition.
     */
    tenant: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `token` property definition.
     */
    token: {
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
  private _name: null | string = null;

  /**
   * A `name` setter.
   */
  public set name(val: null | string) {
    if (val === null || val === "" || HOST_NAME_REGEXP.test(val)) {
      const old = this._name;
      this._name = val;
      this.requestUpdate("name", old);
    } else {
      console.error(
        `The \`name\` property value "${val}" doesn't match an ` +
          "element schema. Skipped.",
      );
      if (this.getAttribute("name") === val) {
        if (this._name === null) {
          this.removeAttribute("name");
        } else {
          this.setAttribute("name", this._name);
        }
      }
    }
  }

  /**
   * A `name` getter.
   */
  public get name(): null | string {
    return this._name;
  }

  /**
   * A `tenant` private property.
   */
  private _tenant: null | string = null;

  /**
   * A `tenant` setter.
   */
  public set tenant(val: null | string) {
    if (val === null || val === "" || HOST_TENANT_REGEXP.test(val)) {
      const old = this._tenant;
      this._tenant = val;
      this.requestUpdate("tenant", old);
    } else {
      console.error(
        `The \`tenant\` property value "${val}" doesn't match an ` +
          "element schema. Skipped.",
      );
      if (this.getAttribute("tenant") === val) {
        if (this._tenant === null) {
          this.removeAttribute("tenant");
        } else {
          this.setAttribute("tenant", this._tenant);
        }
      }
    }
  }

  /**
   * A `tenant` getter.
   */
  public get tenant(): null | string {
    return this._tenant;
  }

  /**
   * A `token` private property.
   */
  private _token: null | string = null;

  /**
   * A `token` setter.
   */
  public set token(val: null | string) {
    if (val === null || val === "" || HOST_TOKEN_REGEXP.test(val)) {
      const old = this._token;
      this._token = val;
      this.requestUpdate("token", old);
    } else {
      console.error(
        `The \`token\` property value "${val}" doesn't match an ` +
          "element schema. Skipped.",
      );
      if (this.getAttribute("token") === val) {
        if (this._token === null) {
          this.removeAttribute("token");
        } else {
          this.setAttribute("token", this._token);
        }
      }
    }
  }

  /**
   * A `token` getter.
   */
  public get token(): null | string {
    return this._token;
  }
}

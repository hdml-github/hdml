/**
 * @fileoverview The `ModelElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { UnifiedElement } from "./UnifiedElement";
import { HOST_NAME_REGEXP, HostElement } from "./HostElement";
import { getHostTag } from "../helpers/elementsRegister";

export const MODEL_NAME_REGEXP = /^[a-zA-Z0-9_]*$/;

/**
 * `ModelElement` class.
 */
export class ModelElement extends UnifiedElement {
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
     * A `host` property definition.
     */
    host: {
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
   * A `host` private property.
   */
  private _host: null | string = null;

  /**
   * A `name` setter.
   */
  public set name(val: null | string) {
    if (val === null || val === "" || MODEL_NAME_REGEXP.test(val)) {
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
   * A `host` setter.
   */
  public set host(val: null | string) {
    if (val === null || val === "" || HOST_NAME_REGEXP.test(val)) {
      const old = this._host;
      this._host = val;
      this.requestUpdate("host", old);
    } else {
      console.error(
        `The \`host\` property value "${val}" doesn't match an ` +
          "element schema. Skipped.",
      );
      if (this.getAttribute("host") === val) {
        if (this._host === null) {
          this.removeAttribute("host");
        } else {
          this.setAttribute("host", this._host);
        }
      }
    }
  }

  /**
   * A `host` getter.
   */
  public get host(): null | string {
    return this._host;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    this._requestUpdates(this.host);
  }

  /**
   * @override
   */
  public attributeChangedCallback(
    name: string,
    old: string,
    value: string,
  ): void {
    super.attributeChangedCallback(name, old, value);
    this._requestUpdates(value);
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._requestUpdates(this.host);
  }

  private _requestUpdates(name: null | string): void {
    if (name) {
      const host = <HostElement>(
        document.querySelector(`${getHostTag()}[name="${name}"]`)
      );
      if (host) {
        host.requestUpdates();
      }
    }
  }

  /**
   * Component template.
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }
}

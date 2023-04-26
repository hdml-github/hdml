/**
 * @fileoverview The `HostElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import "whatwg-fetch";
import { html, TemplateResult } from "lit";
import { debounce } from "throttle-debounce";
import { Document } from "@hdml/schema";
import * as arrow from "apache-arrow";
import {
  IO_NAME_REGEXP,
  IO_HOST_REGEXP,
  IO_TENANT_REGEXP,
  IO_TOKEN_REGEXP,
} from "../helpers/constants";
import { UnifiedElement } from "./UnifiedElement";
import { IModelTarget, ModelElement } from "./ModelElement";

import { data } from "./TestQuery";

/**
 * `IoElement` class.
 */
export class IoElement extends UnifiedElement {
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
   * A `host` private property.
   */
  private _host: null | string = null;

  /**
   * A `tenant` private property.
   */
  private _tenant: null | string = null;

  /**
   * A `token` private property.
   */
  private _token: null | string = null;

  /**
   * Debouncer to delay `hdml`-elements
   */
  private _debouncer: null | debounce<() => void> = null;

  /**
   * A `name` setter.
   */
  public set name(val: null | string) {
    if (val === null || val === "" || IO_NAME_REGEXP.test(val)) {
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
    if (val === null || val === "" || IO_HOST_REGEXP.test(val)) {
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
   * A `tenant` setter.
   */
  public set tenant(val: null | string) {
    if (val === null || val === "" || IO_TENANT_REGEXP.test(val)) {
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
   * A `token` setter.
   */
  public set token(val: null | string) {
    if (val === null || val === "" || IO_TOKEN_REGEXP.test(val)) {
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

  public constructor() {
    super();
    this.listenHdmlElements();
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();

    this._debouncer = debounce(10, async () => {
      await this.fetchData();
    });
    this._debouncer();
  }

  private listenHdmlElements(): void {
    document.body.addEventListener(
      "hdml-model-connected",
      (event: CustomEvent<IModelTarget>) => {
        const model = event.detail.hdmlTarget;
        console.log("hdml-model-connected", model);

        model.addEventListener(
          "hdml-model-changed",
          (event: CustomEvent<IModelTarget>) => {
            const model = event.detail.hdmlTarget;
            console.log("hdml-model-changed", model);
          },
        );
      },
    );
    document.body.addEventListener(
      "hdml-model-disconnected",
      (event: CustomEvent<IModelTarget>) => {
        const model = event.detail.hdmlTarget;
        console.log("hdml-model-disconnected", model);
      },
    );
  }

  private async fetchData(): Promise<void> {
    console.log("fetching");
    const doc = new Document(data);
    try {
      const response = await fetch(this._host || "localhost", {
        method: "POST",
        mode: "cors",
        redirect: "follow",
        cache: "no-cache",
        headers: {
          Accept: "text/html; charset=utf-8",
          "Content-Type": "text/html; charset=utf-8",
        },
        body: doc.buffer,
      });
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      const buffer = await response.arrayBuffer();
      const array = new Uint8Array(buffer);
      const table = arrow.tableFromIPC(array);
      console.log(table.toString());
    } catch (err) {
      console.error(err);
    }
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
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._debouncer && this._debouncer.cancel();
  }

  /**
   * Component template.
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }
}

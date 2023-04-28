/**
 * @fileoverview The `IoElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import "whatwg-fetch";
import { html, TemplateResult } from "lit";
import { debounce } from "throttle-debounce";
import * as arrow from "apache-arrow";
import { Document, DocumentData } from "@hdml/schema";
import {
  IO_NAME_REGEXP,
  IO_HOST_REGEXP,
  IO_TENANT_REGEXP,
  IO_TOKEN_REGEXP,
} from "../helpers/constants";
import { getModelTag } from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";
import { ModelEventDetail, ModelElement } from "./ModelElement";
import "../events";

import { data } from "./TestQuery";

/**
 * The `IoElement` class.
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
   * Attached `hdml-model` elements map.
   */
  private _models: Map<string, ModelElement> = new Map();

  /**
   * Query debouncer.
   */
  private _debouncer: null | debounce<
    (q: null | DocumentData) => Promise<void>
  > = null;

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

  /**
   * Class constructor.
   */
  public constructor() {
    super();
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    this._watchModels();
    this._debouncer = debounce(50, async (q: null | DocumentData) => {
      await this._fetchData(q);
    });
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
    this._unwatchModels();
    this._debouncer && this._debouncer.cancel();
  }

  /**
   * Component template.
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }

  /**
   * Starts watching for the `hdml-model` elements changes.
   */
  private _watchModels(): void {
    document.querySelectorAll(getModelTag()).forEach((model) => {
      this._attachModel(<ModelElement>model);
    });
    document.body.addEventListener(
      "hdml-model:connected",
      this._modelConnectedListener,
    );
    document.body.addEventListener(
      "hdml-model:disconnected",
      this._modelDisconnectedListener,
    );
  }

  /**
   * Stops watching for the `hdml-model` elements changes.
   */
  private _unwatchModels(): void {
    document.body.removeEventListener(
      "hdml-model:connected",
      this._modelConnectedListener,
    );
    document.body.removeEventListener(
      "hdml-model:disconnected",
      this._modelDisconnectedListener,
    );
    this._models.forEach((model) => {
      this._detachModel(model);
    });
    this._models.clear();
  }

  /**
   * The `hdml-model:connected` event listener.
   */
  private _modelConnectedListener = (
    event: CustomEvent<ModelEventDetail>,
  ) => {
    const model = event.detail.model;
    this._attachModel(model);
  };

  /**
   * The `hdml-model:disconnected` event listener.
   */
  private _modelDisconnectedListener = (
    event: CustomEvent<ModelEventDetail>,
  ) => {
    const model = event.detail.model;
    this._detachModel(model);
  };

  /**
   * The `hdml-model:changed` event listener.
   */
  private _modelChangedListener = (
    event: CustomEvent<ModelEventDetail>,
  ) => {
    const model = event.detail.model;
    this._processModel(model);
  };

  /**
   * Attaches `hdml-model` element to the models map.
   */
  private _attachModel(model: ModelElement) {
    if (!this._models.has(model.uid)) {
      this._models.set(model.uid, model);
      model.addEventListener(
        "hdml-model:changed",
        this._modelChangedListener,
      );
      this._processModel(model);
    }
  }

  /**
   * Detaches `hdml-model` element from the models map.
   */
  private _detachModel(model: ModelElement) {
    if (this._models.has(model.uid)) {
      model.removeEventListener(
        "hdml-model:changed",
        this._modelChangedListener,
      );
      this._models.delete(model.uid);
    }
  }

  /**
   * Processes the `model`.
   */
  private _processModel(model: ModelElement) {
    this._debouncer &&
      this._debouncer({
        name: "Test HDML Document.",
        tenant: "common",
        token: "sometokenhere",
        model: model.toJSON(),
      });
  }

  private async _fetchData(q: null | DocumentData): Promise<void> {
    console.log("fetching");
    const doc = new Document(q || data);
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
}

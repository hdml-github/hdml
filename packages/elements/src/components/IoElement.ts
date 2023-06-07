/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import "whatwg-fetch";
import { html, TemplateResult } from "lit";
import { debounce } from "throttle-debounce";
import { Table } from "apache-arrow";
import { Query, QueryDef, ModelDef, FrameDef } from "@hdml/schema";
import {
  IO_NAME_REGEXP,
  IO_HOST_REGEXP,
  IO_TENANT_REGEXP,
  IO_TOKEN_REGEXP,
} from "../helpers/constants";
import {
  getModelTag,
  getFrameTag,
} from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";
import { ModelDetail, ModelElement } from "./ModelElement";
import { FrameDetail, FrameElement } from "./FrameElement";
import { Client } from "../services/Client";

/**
 * An `hdml-data` event details interface.
 */
export interface DataDetail {
  table: Table;
}

/**
 * A definition of the `HDML` elements retrieved from the current
 * `HTML` document.
 */
export type ElementsDef = {
  models: {
    [name: string]: ModelDef;
  };
  frames: {
    [name: string]: FrameDef;
  };
};

/**
 * `IoElement` class. Responsible for session initialization, as well
 * as network interaction with the `io`-server.
 */
export class IoElement extends UnifiedElement {
  /**
   * Reactive attributes.
   */
  public static properties = {
    /**
     * The `name` property definition.
     */
    name: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * The `host` property definition.
     */
    host: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * The `tenant` property definition.
     */
    tenant: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * The `token` property definition.
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
   * The `name` private property.
   */
  private _name: null | string = null;

  /**
   * The `host` private property.
   */
  private _host: null | string = null;

  /**
   * The `tenant` private property.
   */
  private _tenant: null | string = null;

  /**
   * The `token` private property.
   */
  private _token: null | string = null;

  /**
   * Attached `ModelElement` elements map.
   */
  private _models: Map<string, ModelElement> = new Map();

  /**
   * Attached `FrameElement` elements map.
   */
  private _frames: Map<string, FrameElement> = new Map();

  /**
   * Queries map.
   */
  private _queries: Map<string, Query> = new Map();

  /**
   * Promises that resolve after all updates to `ModelElement` or
   * `FrameElement` have been performed.
   */
  private _updatesPromises: {
    model: {
      promise: null | Promise<void>;
      resolve: null | (() => void);
      reject: null | ((reason: string) => void);
    };
    frame: {
      promise: null | Promise<void>;
      resolve: null | (() => void);
      reject: null | ((reason: unknown) => void);
    };
  } = {
    model: {
      promise: null,
      resolve: null,
      reject: null,
    },
    frame: {
      promise: null,
      resolve: null,
      reject: null,
    },
  };

  /**
   * `ModelElement` update debouncer.
   */
  private _updateModel: null | debounce<() => Promise<void>> = null;

  /**
   * `FrameElement` update debouncer.
   */
  private _updateFrame: null | debounce<() => Promise<void>> = null;

  /**
   * Network client.
   */
  private _client: null | Client = null;

  /**
   * The `name` setter.
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
   * The `name` getter.
   */
  public get name(): null | string {
    return this._name;
  }

  /**
   * The `host` setter.
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
   * The `host` getter.
   */
  public get host(): null | string {
    return this._host;
  }

  /**
   * The `tenant` setter.
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
   * The `tenant` getter.
   */
  public get tenant(): null | string {
    return this._tenant;
  }

  /**
   * The `token` setter.
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
   * The `token` getter.
   */
  public get token(): null | string {
    return this._token;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    this._watchModels();
    this._watchFrames();
    this._updateModel = debounce(50, this._modelDebounceCallback);
    this._updateFrame = debounce(50, this._frameDebounceCallback);
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
    this._client && this._client.close();
    this._client = new Client(
      this.host || undefined,
      this.tenant || undefined,
      this.token || undefined,
    );
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    // this._updatesPromises.model.reject &&
    // this._updatesPromises.model.reject("Disconnected `IoElement`");
    this._updatesPromises.model = {
      promise: null,
      resolve: null,
      reject: null,
    };
    // this._updatesPromises.frame.reject &&
    // this._updatesPromises.frame.reject("Disconnected `IoElement`");
    this._updatesPromises.frame = {
      promise: null,
      resolve: null,
      reject: null,
    };
    this._client && this._client.close();
    this._updateModel && this._updateModel.cancel();
    this._updateFrame && this._updateFrame.cancel();
    this._updateModel = null;
    this._updateFrame = null;
    this._unwatchModels();
    this._unwatchFrames();
    super.disconnectedCallback();
  }

  /**
   * Component renderer.
   */
  public render(): TemplateResult<1> {
    return html`<!-- IoElement -->`;
  }

  /**
   * Returns a definition of the `HDML` elements retrieved from the
   * current `HTML` document.
   * @throws
   */
  public async getElementsDef(): Promise<ElementsDef> {
    await this._updates();
    const models: { [name: string]: ModelDef } = {};
    const frames: { [name: string]: FrameDef } = {};

    // models
    this._models.forEach((model) => {
      const data = model.data;
      models[data.name] = data;
    });

    // frames
    this._frames.forEach((frame) => {
      let source = frame.source;
      let _frame = frame.data;
      const name = _frame.name;
      const body = _frame;
      while (source && source.indexOf("?") === 0) {
        if (source.indexOf("?hdml-model=") === 0) {
          source = null;
        } else {
          const [, frameName] = source.split("?hdml-frame=");
          let linked = false;
          this._frames.forEach((frame) => {
            if (frame.name === frameName) {
              linked = true;
              source = frame.source;
              _frame.parent = frame.data;
              _frame = _frame.parent;
            }
          });
          if (!linked) {
            throw new Error(
              `Specified \`hdml-frame\` is missed: ${frameName}`,
            );
          }
        }
      }
      frames[name] = body;
    });
    return { models, frames };
  }

  /**
   * Returns a query generated with respect to the `HDML` element
   * (`ModelElement` or `FrameElement`) whose identifier is specified
   * in the `uid` parameter.
   */
  public async getQuery(uid: string): Promise<null | Query> {
    await this._updates();
    if (!this._queries.has(uid)) {
      return null;
    } else {
      return <Query>this._queries.get(uid);
    }
  }

  /**
   * Starts tracking changes to `ModelElement` elements.
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
   * Starts tracking changes to `FrameElement` elements.
   */
  private _watchFrames(): void {
    document.querySelectorAll(getFrameTag()).forEach((frame) => {
      this._attachFrame(<FrameElement>frame);
    });
    document.body.addEventListener(
      "hdml-frame:connected",
      this._frameConnectedListener,
    );
    document.body.addEventListener(
      "hdml-frame:disconnected",
      this._frameDisconnectedListener,
    );
  }

  /**
   * Stops watching for changes to `ModelElement` elements.
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
   * Stops watching for changes to `FrameElement` elements.
   */
  private _unwatchFrames(): void {
    document.body.removeEventListener(
      "hdml-frame:connected",
      this._frameConnectedListener,
    );
    document.body.removeEventListener(
      "hdml-frame:disconnected",
      this._frameDisconnectedListener,
    );
    this._frames.forEach((frame) => {
      this._detachFrame(frame);
    });
    this._frames.clear();
  }

  /**
   * `hdml-model:connected` event listener.
   */
  private _modelConnectedListener = (
    event: CustomEvent<ModelDetail>,
  ) => {
    const model = event.detail.model;
    this._attachModel(model);
  };

  /**
   * `hdml-frame:connected` event listener.
   */
  private _frameConnectedListener = (
    event: CustomEvent<FrameDetail>,
  ) => {
    const frame = event.detail.frame;
    this._attachFrame(frame);
  };

  /**
   * `hdml-model:disconnected` event listener.
   */
  private _modelDisconnectedListener = (
    event: CustomEvent<ModelDetail>,
  ) => {
    const model = event.detail.model;
    this._detachModel(model);
  };

  /**
   * `hdml-frame:disconnected` event listener.
   */
  private _frameDisconnectedListener = (
    event: CustomEvent<FrameDetail>,
  ) => {
    const frame = event.detail.frame;
    this._detachFrame(frame);
  };

  /**
   * `hdml-model:changed` event listener.
   */
  private _modelChangedListener = () => {
    this._handleModelsUpdates();
  };

  /**
   * `hdml-model:request` event listener.
   */
  private _modelRequestListener = (
    event: CustomEvent<ModelDetail>,
  ) => {
    this._handleQuery(event.detail.model.uid).catch((reason) => {
      console.error(reason);
    });
  };

  /**
   * `hdml-frame:changed` event listener.
   */
  private _frameChangedListener = () => {
    this._handleFramesUpdates();
  };

  /**
   * `hdml-frame:request` event listener.
   */
  private _frameRequestListener = (
    event: CustomEvent<FrameDetail>,
  ) => {
    this._handleQuery(event.detail.frame.uid).catch((reason) => {
      console.error(reason);
    });
  };

  /**
   * Attaches a `ModelElement` element to the models map.
   */
  private _attachModel(model: ModelElement) {
    if (model.uid && !this._models.has(model.uid)) {
      this._models.set(model.uid, model);
      model.addEventListener(
        "hdml-model:changed",
        this._modelChangedListener,
      );
      model.addEventListener(
        "hdml-model:request",
        this._modelRequestListener,
      );
      this._handleModelsUpdates();
    }
  }

  /**
   * Attaches `FrameElement` element to the frames map.
   */
  private _attachFrame(frame: FrameElement) {
    if (frame.uid && !this._frames.has(frame.uid)) {
      this._frames.set(frame.uid, frame);
      frame.addEventListener(
        "hdml-frame:changed",
        this._frameChangedListener,
      );
      frame.addEventListener(
        "hdml-frame:request",
        this._frameRequestListener,
      );
      this._handleFramesUpdates();
    }
  }

  /**
   * Detaches `ModelElement` element from the models map.
   */
  private _detachModel(model: ModelElement) {
    if (model.uid && this._models.has(model.uid)) {
      model.removeEventListener(
        "hdml-model:changed",
        this._modelChangedListener,
      );
      model.removeEventListener(
        "hdml-model:request",
        this._modelRequestListener,
      );
      this._models.delete(model.uid);
      this._queries.delete(model.uid);
    }
  }

  /**
   * Detaches `FrameElement` element from the frames map.
   */
  private _detachFrame(frame: FrameElement) {
    if (frame.uid && this._frames.has(frame.uid)) {
      frame.removeEventListener(
        "hdml-frame:changed",
        this._frameChangedListener,
      );
      frame.removeEventListener(
        "hdml-frame:request",
        this._frameRequestListener,
      );
      this._frames.delete(frame.uid);
      this._queries.delete(frame.uid);
    }
  }

  /**
   * Handles models updates.
   */
  private _handleModelsUpdates() {
    if (this._updateModel) {
      if (!this._updatesPromises.model.promise) {
        this._updatesPromises.model.promise = new Promise(
          (resolve, reject) => {
            this._updatesPromises.model.resolve = resolve;
            this._updatesPromises.model.reject = reject;
          },
        );
      }
      this._updateModel();
    }
  }

  /**
   * Handles frames updates.
   */
  private _handleFramesUpdates() {
    if (this._updateFrame) {
      if (!this._updatesPromises.frame.promise) {
        this._updatesPromises.frame.promise = new Promise(
          (resolve, reject) => {
            this._updatesPromises.frame.resolve = resolve;
            this._updatesPromises.frame.reject = reject;
          },
        );
      }
      this._updateFrame();
    }
  }

  /**
   * Handles query.
   * @throws
   */
  private async _handleQuery(uid: string): Promise<void> {
    await this._updates();
    if (!this._queries.has(uid)) {
      throw new Error(`Query is missing: ${uid}`);
    } else {
      const query = <Query>this._queries.get(uid);
      if (!this._client) {
        throw new Error("Client is missing");
      } else {
        const name = await this._client.postQuery(
          uid,
          <Buffer>query.buffer,
        );
        const table = await this._client.getFile(uid, name);
        let target: false | Element = false;
        if (this._models.has(uid)) {
          target = <ModelElement>this._models.get(uid);
        }
        if (this._frames.has(uid)) {
          target = <FrameElement>this._frames.get(uid);
        }
        if (target) {
          target.dispatchEvent(
            new CustomEvent<DataDetail>("hdml-data", {
              cancelable: false,
              composed: false,
              bubbles: false,
              detail: {
                table,
              },
            }),
          );
        }
      }
    }
  }

  /**
   * Callback of the `ModelElement` changes debouncer.
   */
  private _modelDebounceCallback = () => {
    this._models.forEach((model) => {
      const queryDef: QueryDef = {
        model: model.data,
      };
      this._queries.set(model.uid, new Query(queryDef));
    });
    this._updatesPromises.model.resolve &&
      this._updatesPromises.model.resolve();
    this._updatesPromises.model = {
      promise: null,
      resolve: null,
      reject: null,
    };
  };

  /**
   * Callback of the `FrameElement` changes debouncer.
   */
  private _frameDebounceCallback = () => {
    this._frames.forEach((frame) => {
      let source = frame.source;
      let _frame = frame.data;
      const queryDef: QueryDef = {
        frame: _frame,
      };
      while (source && source.indexOf("?") === 0) {
        if (source.indexOf("?hdml-model=") === 0) {
          const [, modelName] = source.split("?hdml-model=");
          this._models.forEach((model) => {
            if (model.name === modelName) {
              queryDef.model = model.data;
            }
          });
          source = null;
        } else if (source.indexOf("?hdml-frame=") === 0) {
          const [, frameName] = source.split("?hdml-frame=");
          let linked = false;
          this._frames.forEach((frame) => {
            if (frame.name === frameName) {
              linked = true;
              source = frame.source;
              _frame.parent = frame.data;
              _frame = _frame.parent;
            }
          });
          if (!linked) {
            throw new Error(`Invalid \`source\` link: ${source}`);
          }
        } else {
          throw new Error(`Invalid \`source\` value: ${source}`);
        }
      }
      this._queries.set(frame.uid, new Query(queryDef));
    });
    this._updatesPromises.frame.resolve &&
      this._updatesPromises.frame.resolve();
    this._updatesPromises.frame = {
      promise: null,
      resolve: null,
      reject: null,
    };
  };

  /**
   * Waits for the updates of the `ModelElement` and `FrameElement` to
   * complete.
   */
  private async _updates(): Promise<void> {
    const promises: Promise<void>[] = [];
    if (this._updatesPromises.model.promise) {
      promises.push(this._updatesPromises.model.promise);
    }
    if (this._updatesPromises.frame.promise) {
      promises.push(this._updatesPromises.frame.promise);
    }
    await Promise.all(promises);
  }
}

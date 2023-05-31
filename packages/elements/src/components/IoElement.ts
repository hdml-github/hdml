/**
 * @fileoverview The `IoElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import "whatwg-fetch";
import { html, TemplateResult } from "lit";
import { debounce } from "throttle-debounce";
import {
  Document,
  DocumentData,
  ModelData,
  FrameData,
} from "@hdml/schema";

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
import { ModelEventDetail, ModelElement } from "./ModelElement";
import { FrameEventDetail, FrameElement } from "./FrameElement";
import { Client } from "../services/Client";

/**
 * An `IoElement` `json` representation.
 */
export type ElementsData = {
  models: {
    [name: string]: ModelData;
  };
  frames: {
    [name: string]: FrameData;
  };
};

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
   * Attached `hdml-frame` elements map.
   */
  private _frames: Map<string, FrameElement> = new Map();

  /**
   * Parsed `hdml` documents map.
   */
  private _documents: Map<string, Document> = new Map();

  /**
   * Promises that are resolved once all `hdml-model` or `hdml-frame`
   * updates are done.
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
   * The `hdml-model` update debouncer.
   */
  private _updateModel: null | debounce<() => Promise<void>> = null;

  /**
   * The `hdml-frame` update debouncer.
   */
  private _updateFrame: null | debounce<() => Promise<void>> = null;

  /**
   * Data client.
   */
  private _client: null | Client = null;

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
   * Component template.
   */
  public render(): TemplateResult<1> {
    return html`<!-- IoElement -->`;
  }

  /**
   * Returns data objects of the `model`s and `frame`s elements
   * available in the current `html` document. Throws if detects local
   * `frame`s links disintegrity (i.e when a local `frame` specified
   * in the `source` attribute of another local `frame` is missed in
   * the document).
   * @throws
   */
  public async getElementsData(): Promise<ElementsData> {
    await this._updates();
    const models: { [name: string]: ModelData } = {};
    const frames: { [name: string]: FrameData } = {};

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
   * Returns `hdml` document specified by the `uid` if it exist in the
   * current `html` document, `null` otherwise.
   */
  public async getHdmlDocument(
    uid: string,
  ): Promise<null | Document> {
    await this._updates();
    if (!this._documents.has(uid)) {
      return null;
    } else {
      const document = <Document>this._documents.get(uid);
      return document;
    }
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
   * Starts watching for the `hdml-frame` elements changes.
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
   * Stops watching for the `hdml-frame` elements changes.
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
   * The `hdml-model:connected` event listener.
   */
  private _modelConnectedListener = (
    event: CustomEvent<ModelEventDetail>,
  ) => {
    const model = event.detail.model;
    this._attachModel(model);
  };

  /**
   * The `hdml-frame:connected` event listener.
   */
  private _frameConnectedListener = (
    event: CustomEvent<FrameEventDetail>,
  ) => {
    const frame = event.detail.frame;
    this._attachFrame(frame);
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
   * The `hdml-frame:disconnected` event listener.
   */
  private _frameDisconnectedListener = (
    event: CustomEvent<FrameEventDetail>,
  ) => {
    const frame = event.detail.frame;
    this._detachFrame(frame);
  };

  /**
   * The `hdml-model:changed` event listener.
   */
  private _modelChangedListener = (
    event: CustomEvent<ModelEventDetail>,
  ) => {
    this._processModel();
  };

  /**
   * The `hdml-model:request` event listener.
   */
  private _modelRequestListener = (
    event: CustomEvent<ModelEventDetail>,
  ) => {
    this._processRequest(event.detail.model.uid).catch((reason) => {
      console.error(reason);
    });
  };

  /**
   * The `hdml-frame:changed` event listener.
   */
  private _frameChangedListener = (
    event: CustomEvent<FrameEventDetail>,
  ) => {
    this._processFrame();
  };

  /**
   * The `hdml-frame:request` event listener.
   */
  private _frameRequestListener = (
    event: CustomEvent<FrameEventDetail>,
  ) => {
    this._processRequest(event.detail.frame.uid).catch((reason) => {
      console.error(reason);
    });
  };

  /**
   * Attaches `hdml-model` element to the models map.
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
      this._processModel();
    }
  }

  /**
   * Attaches `hdml-frame` element to the frames map.
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
      this._processFrame();
    }
  }

  /**
   * Detaches `hdml-model` element from the models map.
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
      this._documents.delete(model.uid);
    }
  }

  /**
   * Detaches `hdml-frame` element from the frames map.
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
      this._documents.delete(frame.uid);
    }
  }

  /**
   * Processes models.
   */
  private _processModel() {
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
   * Processes frames.
   */
  private _processFrame() {
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
   * Process request.
   * @throws
   */
  private async _processRequest(uid: string): Promise<void> {
    await this._updates();
    if (!this._documents.has(uid)) {
      throw new Error(`Document is missing: ${uid}`);
    } else {
      const doc = <Document>this._documents.get(uid);
      if (!this._client) {
        throw new Error("Client is missing");
      } else {
        const identifier = await this._client.hdmlPost(
          uid,
          <Buffer>doc.buffer,
        );
        console.log(identifier);
      }
    }
  }

  /**
   * The `hdml-model` changed debouncer callback.
   */
  private _modelDebounceCallback = () => {
    this._models.forEach((model) => {
      const data: DocumentData = {
        name: "",
        tenant: "",
        token: "",
        model: model.data,
      };
      this._documents.set(model.uid, new Document(data));
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
   * The `hdml-frame` changed debouncer callback.
   */
  private _frameDebounceCallback = () => {
    this._frames.forEach((frame) => {
      let source = frame.source;
      let _frame = frame.data;
      const data: DocumentData = {
        name: "",
        tenant: "",
        token: "",
        frame: _frame,
      };
      while (source && source.indexOf("?") === 0) {
        if (source.indexOf("?hdml-model=") === 0) {
          const [, modelName] = source.split("?hdml-model=");
          this._models.forEach((model) => {
            if (model.name === modelName) {
              data.model = model.data;
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
      this._documents.set(frame.uid, new Document(data));
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
   * Awaits the `hdml-model` and `hdml-frame` elements updates.
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
/**
 * @fileoverview The `FrameElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { FieldData, FrameData } from "@hdml/schema";

import "../events";
import {
  FRAME_NAME_REGEXP,
  FRAME_SOURCE_REGEXP,
  FRAME_OFFSET_REGEXP,
  FRAME_LIMIT_REGEXP,
} from "../helpers/constants";
import { getFieldTag } from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";
import { FieldElement, FieldEventDetail } from "./FieldElement";

/**
 * An `hdml-frame` element event detail interface.
 */
export interface FrameEventDetail {
  frame: FrameElement;
}

/**
 * The `FrameElement` class.
 */
export class FrameElement extends UnifiedElement {
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
     * A `source` property definition.
     */
    source: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `offset` property definition.
     */
    offset: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `limit` property definition.
     */
    limit: {
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
   * A `source` private property.
   */
  private _source: null | string = null;

  /**
   * A `offset` private property.
   */
  private _offset: null | string = null;

  /**
   * A `source` private property.
   */
  private _limit: null | string = null;

  /**
   * Attached `hdml-field` elements map.
   */
  private _fields: Map<string, FieldElement> = new Map();

  /**
   * A `name` setter.
   */
  public set name(val: null | string) {
    if (val === null || val === "" || FRAME_NAME_REGEXP.test(val)) {
      const old = this._name;
      this._name = val;
      this.requestUpdate("name", old);
    } else {
      console.error(
        `The \`name\` property value "${val}" doesn't match an ` +
          "element RegExp.",
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
   * A `source` setter.
   */
  public set source(val: null | string) {
    if (val === null || val === "" || FRAME_SOURCE_REGEXP.test(val)) {
      const old = this._source;
      this._source = val;
      this.requestUpdate("source", old);
    } else {
      console.error(
        `The \`source\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("source") === val) {
        if (this._source === null) {
          this.removeAttribute("source");
        } else {
          this.setAttribute("source", this._source);
        }
      }
    }
  }

  /**
   * A `source` getter.
   */
  public get source(): null | string {
    return this._source ? this._source.replaceAll("`", '"') : null;
  }

  /**
   * A `offset` setter.
   */
  public set offset(val: null | string) {
    if (val === null || val === "" || FRAME_OFFSET_REGEXP.test(val)) {
      const old = this._offset;
      this._offset = val;
      this.requestUpdate("offset", old);
    } else {
      console.error(
        `The \`offset\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("offset") === val) {
        if (this._offset === null) {
          this.removeAttribute("offset");
        } else {
          this.setAttribute("offset", this._offset);
        }
      }
    }
  }

  /**
   * A `offset` getter.
   */
  public get offset(): null | string {
    return this._offset;
  }

  /**
   * A `limit` setter.
   */
  public set limit(val: null | string) {
    if (val === null || val === "" || FRAME_LIMIT_REGEXP.test(val)) {
      const old = this._limit;
      this._limit = val;
      this.requestUpdate("limit", old);
    } else {
      console.error(
        `The \`limit\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("limit") === val) {
        if (this._limit === null) {
          this.removeAttribute("limit");
        } else {
          this.setAttribute("limit", this._limit);
        }
      }
    }
  }

  /**
   * A `limit` getter.
   */
  public get limit(): null | string {
    return this._limit;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    document.body.dispatchEvent(
      new CustomEvent<FrameEventDetail>("hdml-frame:connected", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          frame: this,
        },
      }),
    );
    this._watchFields();
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
    this._dispatchChangedEvent();
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    this._unwatchFields();
    document.body.dispatchEvent(
      new CustomEvent<FrameEventDetail>("hdml-frame:disconnected", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          frame: this,
        },
      }),
    );
    super.disconnectedCallback();
  }

  /**
   * Component template.
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }

  /**
   * Returns frame `JSON`-representation.
   */
  public toJSON(): FrameData {
    if (!this.name) {
      throw new Error("A `name` property is required.");
    }
    if (!this.source) {
      throw new Error("A `source` property is required.");
    }
    const fields: FieldData[] = [];
    this._fields.forEach((field) => {
      fields.push(field.toJSON());
    });
    return {
      name: this.name,
      host: "",
      source: this.source,
      offset: parseInt(this.offset || "0", 10),
      limit: parseInt(this.limit || "50000", 10),
      fields,
      filterBy: undefined,
      groupBy: undefined,
      splitBy: undefined,
      sortBy: undefined,
      parent: undefined,
    };
  }

  /**
   * Starts watching for the `hdml-field` elements changes.
   */
  private _watchFields(): void {
    this.querySelectorAll(getFieldTag()).forEach((field) => {
      this._attachField(<FieldElement>field);
    });
    this.addEventListener(
      "hdml-field:connected",
      this._fieldConnectedListener,
    );
    this.addEventListener(
      "hdml-field:disconnected",
      this._fieldDisconnectedListener,
    );
  }

  /**
   * Stops watching for the `hdml-field` elements changes.
   */
  private _unwatchFields(): void {
    this.removeEventListener(
      "hdml-field:connected",
      this._fieldConnectedListener,
    );
    this.removeEventListener(
      "hdml-field:disconnected",
      this._fieldDisconnectedListener,
    );
    this._fields.forEach((field) => {
      this._detachField(field);
    });
    this._fields.clear();
  }

  /**
   * The `hdml-field:connected` event listener.
   */
  private _fieldConnectedListener = (
    event: CustomEvent<FieldEventDetail>,
  ) => {
    const field = event.detail.field;
    this._attachField(field);
  };

  /**
   * The `hdml-field:disconnected` event listener.
   */
  private _fieldDisconnectedListener = (
    event: CustomEvent<FieldEventDetail>,
  ) => {
    const field = event.detail.field;
    this._detachField(field);
  };

  /**
   * The `hdml-field:changed` event listener.
   */
  private _fieldChangedListener = (
    event: CustomEvent<FieldEventDetail>,
  ) => {
    this._dispatchChangedEvent();
  };

  /**
   * Attaches `hdml-field` element to the fields map.
   */
  private _attachField(field: FieldElement) {
    if (!this._fields.has(field.uid)) {
      this._fields.set(field.uid, field);
      field.addEventListener(
        "hdml-field:changed",
        this._fieldChangedListener,
      );
      this._dispatchChangedEvent();
    }
  }

  /**
   * Detaches `hdml-field` element from the fields map.
   */
  private _detachField(field: FieldElement) {
    if (this._fields.has(field.uid)) {
      field.removeEventListener(
        "hdml-field:changed",
        this._fieldChangedListener,
      );
      this._fields.delete(field.uid);
      this._dispatchChangedEvent();
    }
  }

  /**
   * Dispatches the `hdml-frame:changed` event.
   */
  private _dispatchChangedEvent(): void {
    this.dispatchEvent(
      new CustomEvent<FrameEventDetail>("hdml-frame:changed", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          frame: this,
        },
      }),
    );
  }
}

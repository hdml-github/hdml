/**
 * @fileoverview The `TableElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { FieldData, TableData, TableType } from "@hdml/schema";

import "../events";
import {
  TABLE_NAME_REGEXP,
  TABLE_TYPE_REGEXP,
  TABLE_SOURCE_REGEXP,
} from "../helpers/constants";
import {
  getFieldTag,
  getModelTag,
} from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";
import { FieldElement, FieldEventDetail } from "./FieldElement";

/**
 * An `hdml-table` element event detail interface.
 */
export interface TableEventDetail {
  table: TableElement;
}

/**
 * The `TableElement` class.
 */
export class TableElement extends UnifiedElement {
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
     * A `type` property definition.
     */
    type: {
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
  };

  /**
   * A `name` private property.
   */
  private _name: null | string = null;

  /**
   * A `type` private property.
   */
  private _type: null | string = null;

  /**
   * A `source` private property.
   */
  private _source: null | string = null;

  /**
   * An assosiated `hdml-model` element.
   */
  private _model: null | Element = null;

  /**
   * Attached `hdml-field` elements map.
   */
  private _fields: Map<string, FieldElement> = new Map();

  /**
   * A `name` setter.
   */
  public set name(val: null | string) {
    if (val === null || val === "" || TABLE_NAME_REGEXP.test(val)) {
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
   * A `type` setter.
   */
  public set type(val: null | string) {
    if (val === null || val === "" || TABLE_TYPE_REGEXP.test(val)) {
      const old = this._type;
      this._type = val;
      this.requestUpdate("type", old);
    } else {
      console.error(
        `The \`type\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("type") === val) {
        if (this._type === null) {
          this.removeAttribute("type");
        } else {
          this.setAttribute("type", this._type);
        }
      }
    }
  }

  /**
   * A `type` getter.
   */
  public get type(): null | string {
    return this._type;
  }

  /**
   * A `source` setter.
   */
  public set source(val: null | string) {
    if (val === null || val === "" || TABLE_SOURCE_REGEXP.test(val)) {
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
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    this._model = this._getModel();
    if (this._model) {
      this._model.dispatchEvent(
        new CustomEvent<TableEventDetail>("hdml-table:connected", {
          cancelable: false,
          composed: false,
          bubbles: false,
          detail: {
            table: this,
          },
        }),
      );
    }
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
    if (this._model) {
      this._model.dispatchEvent(
        new CustomEvent<TableEventDetail>("hdml-table:disconnected", {
          cancelable: false,
          composed: false,
          bubbles: false,
          detail: {
            table: this,
          },
        }),
      );
      this._model = null;
    }
    super.disconnectedCallback();
  }

  /**
   * Component template.
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }

  /**
   * Returns tables' `JSON`-representation.
   */
  public toJSON(): TableData {
    if (!this.name) {
      throw new Error("A `name` property is required.");
    }
    if (!this.type) {
      throw new Error("A `type` property is required.");
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
      type: this._getTableType(this.type),
      source: this.source,
      fields,
    };
  }

  /**
   * Returns assosiated `hdml-model` element if exist or null
   * otherwise.
   */
  private _getModel(): null | Element {
    let element = this.parentElement;
    while (
      element &&
      element.tagName !== "BODY" &&
      element.tagName !== getModelTag().toUpperCase()
    ) {
      element = this.parentElement;
    }
    return element && element.tagName !== "BODY" ? element : null;
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
   * Detaches `hdml-field` element from the tables map.
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
   * Dispatches the `hdml-table:changed` event.
   */
  private _dispatchChangedEvent(): void {
    this.dispatchEvent(
      new CustomEvent<TableEventDetail>("hdml-table:changed", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          table: this,
        },
      }),
    );
  }

  /**
   * Converts `type` property to a `TableType` enum.
   */
  private _getTableType(type: string): TableType {
    switch (type) {
      case "json":
        return TableType.Json;
      case "csv":
        return TableType.Csv;
      case "table":
        return TableType.Table;
      case "query":
        return TableType.Query;
      default:
        throw new Error(`Unsupported table type "${type}".`);
    }
  }
}

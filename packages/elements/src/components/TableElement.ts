/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { FieldDef, TableDef, TableType } from "@hdml/schema";
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
import { FieldElement, FieldDetail } from "./FieldElement";

/**
 * `hdml-table:connected`, `hdml-table:changed`, `hdml-table:request`,
 * `hdml-table:disconnected` events details interface.
 */
export interface TableDetail {
  table: TableElement;
}

/**
 * `TableElement` class. Adds an `HTML` tag (default `hdml-table`)
 * which is the root tag for describing a table for the base data
 * model.
 */
export class TableElement extends UnifiedElement {
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
     * The `type` property definition.
     */
    type: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * The `source` property definition.
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
   * The `name` private property.
   */
  private _name: null | string = null;

  /**
   * The `type` private property.
   */
  private _type: null | string = null;

  /**
   * The `source` private property.
   */
  private _source: null | string = null;

  /**
   * The assosiated `ModelElement` element.
   */
  private _model: null | Element = null;

  /**
   * A map of attached `FieldElement` elements.
   */
  private _fields: Map<string, FieldElement> = new Map();

  /**
   * The `name` setter.
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
   * The `name` getter.
   */
  public get name(): null | string {
    return this._name;
  }

  /**
   * The `type` setter.
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
   * The `type` getter.
   */
  public get type(): null | string {
    return this._type;
  }

  /**
   * The `source` setter.
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
   * The `source` getter.
   */
  public get source(): null | string {
    return this._source ? this._source.replaceAll("`", '"') : null;
  }

  /**
   * An iterable iterator of the table's child fields.
   */
  public get fields(): IterableIterator<FieldElement> {
    return this._fields.values();
  }

  /**
   * The `TableDef` object.
   */
  public get data(): TableDef {
    if (!this.name) {
      throw new Error("A `name` property is required.");
    }
    if (!this.type) {
      throw new Error("A `type` property is required.");
    }
    if (!this.source) {
      throw new Error("A `source` property is required.");
    }
    const fields: FieldDef[] = [];
    this._fields.forEach((field) => {
      fields.push(field.data);
    });
    return {
      name: this.name,
      type: this._getTableType(this.type),
      source: this.source,
      fields,
    };
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    this._model = this._getModel();
    if (this._model) {
      this._model.dispatchEvent(
        new CustomEvent<TableDetail>("hdml-table:connected", {
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
        new CustomEvent<TableDetail>("hdml-table:disconnected", {
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
   * Component renderer.
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }

  /**
   * Returns the associated `ModelElement` element if it exists, or
   * `null` otherwise.
   */
  private _getModel(): null | Element {
    let element = this.parentElement;
    while (
      element &&
      element.tagName !== "BODY" &&
      element.tagName !== getModelTag().toUpperCase()
    ) {
      element = element.parentElement;
    }
    return element && element.tagName !== "BODY" ? element : null;
  }

  /**
   * Starts tracking changes to `FieldElement` elements.
   */
  private _watchFields(): void {
    this.queryHdmlChildren<FieldElement>(getFieldTag()).forEach(
      (field) => {
        this._attachField(field);
      },
    );
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
   * Stops watching for changes to `FieldElement` elements.
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
   * `hdml-field:connected` event listener.
   */
  private _fieldConnectedListener = (
    event: CustomEvent<FieldDetail>,
  ) => {
    const field = event.detail.field;
    this._attachField(field);
  };

  /**
   * `hdml-field:disconnected` event listener.
   */
  private _fieldDisconnectedListener = (
    event: CustomEvent<FieldDetail>,
  ) => {
    const field = event.detail.field;
    this._detachField(field);
  };

  /**
   * `hdml-field:changed` event listener.
   */
  private _fieldChangedListener = () => {
    this._dispatchChangedEvent();
  };

  /**
   * Attaches a `FieldElement` element to the fields map.
   */
  private _attachField(field: FieldElement) {
    if (field.uid && !this._fields.has(field.uid)) {
      this._fields.set(field.uid, field);
      field.addEventListener(
        "hdml-field:changed",
        this._fieldChangedListener,
      );
      this._dispatchChangedEvent();
    }
  }

  /**
   * Detaches `FieldElement` element from the fields map.
   */
  private _detachField(field: FieldElement) {
    if (field.uid && this._fields.has(field.uid)) {
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
      new CustomEvent<TableDetail>("hdml-table:changed", {
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
   * Converts the `type` property to a `TableType` enum.
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

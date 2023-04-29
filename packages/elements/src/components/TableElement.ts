/**
 * @fileoverview The `TableElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { TableData, TableType } from "@hdml/schema";
import {
  TABLE_NAME_REGEXP,
  TABLE_TYPE_REGEXP,
  TABLE_SOURCE_REGEXP,
} from "../helpers/constants";
import { getModelTag } from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";

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
    super.disconnectedCallback();
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
  }

  /**
   * Component template.
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }

  /**
   * Returns model's `JSON`-representation.
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
    return {
      name: this.name,
      type: this._getTableType(this.type),
      source: this.source,
      fields: [],
    };
  }

  /**
   * Converts `type` property to `TableType` enum.
   */
  private _getTableType(type: string): number {
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

  /**
   * Returns assosiated `hdml-model` element if exist or false
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
}

/**
 * @fileoverview The `TableElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import * as CSV from "papaparse";
import { UnifiedElement } from "./UnifiedElement";

export const TABLE_NAME_REGEXP = /^[a-zA-Z0-9_]*$/;
export const DB_TABLE_NAME_REGEXP = /^$/;

/**
 * `ModelElement` class.
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
   * A `type` setter.
   */
  public set type(val: null | string) {
    if (
      val === null ||
      val === "" ||
      // val === "csv" ||
      // val === "json" ||
      val === "table" ||
      val === "query"
    ) {
      const old = this._type;
      this._type = val;
      this.requestUpdate("type", old);
    } else {
      console.error(
        `The \`type\` property value "${val}" doesn't match an ` +
          "element schema. Skipped.",
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
    if (val === null || val === "") {
      const old = this._source;
      this._source = val;
      this.requestUpdate("source", old);
    } else {
      console.error(
        `The \`source\` property value "${val}" doesn't match an ` +
          "element schema. Skipped.",
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
    return this._source;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
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
  }

  /**
   * Parses CSV string to a JSON araay.
   */
  private _parseCSV(val: string): unknown[] {
    return CSV.parse(val, {
      delimiter: ",",
      quoteChar: '"',
      header: false,
      worker: false,
      transform: (val: string) => val.trim(),
    }).data;
  }

  /**
   * Component template.
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }
}

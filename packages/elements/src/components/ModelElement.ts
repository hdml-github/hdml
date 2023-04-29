/**
 * @fileoverview The `ModelElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { ModelData, TableData } from "@hdml/schema";
import { MODEL_NAME_REGEXP } from "../helpers/constants";
import { getTableTag } from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";
import { TableElement, TableEventDetail } from "./TableElement";
import "../events";

/**
 * An `hdml-model` element event detail interface.
 */
export interface ModelEventDetail {
  model: ModelElement;
}

/**
 * The `ModelElement` class.
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
  };

  /**
   * A `name` private property.
   */
  private _name: null | string = null;

  /**
   * Attached `hdml-table` elements map.
   */
  private _tables: Map<string, TableElement> = new Map();

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
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    document.body.dispatchEvent(
      new CustomEvent<ModelEventDetail>("hdml-model:connected", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          model: this,
        },
      }),
    );
    this._watchTables();
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
    this._unwatchTables();
    super.disconnectedCallback();
    document.body.dispatchEvent(
      new CustomEvent<ModelEventDetail>("hdml-model:disconnected", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          model: this,
        },
      }),
    );
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
  public toJSON(): ModelData {
    if (!this.name) {
      throw new Error("A `name` property is required.");
    }
    const tables: TableData[] = [];
    this._tables.forEach((table) => {
      tables.push(table.toJSON());
    });
    return {
      name: this.name,
      host: "",
      tables,
      joins: [],
    };
  }

  /**
   * Starts watching for the `hdml-table` elements changes.
   */
  private _watchTables(): void {
    this.querySelectorAll(getTableTag()).forEach((table) => {
      this._attachTable(<TableElement>table);
    });
    this.addEventListener(
      "hdml-table:connected",
      this._tableConnectedListener,
    );
    this.addEventListener(
      "hdml-table:disconnected",
      this._tableDisconnectedListener,
    );
  }

  /**
   * Stops watching for the `hdml-table` elements changes.
   */
  private _unwatchTables(): void {
    document.body.removeEventListener(
      "hdml-table:connected",
      this._tableConnectedListener,
    );
    document.body.removeEventListener(
      "hdml-table:disconnected",
      this._tableDisconnectedListener,
    );
    this._tables.forEach((table) => {
      this._detachTable(table);
    });
    this._tables.clear();
  }

  /**
   * The `hdml-table:connected` event listener.
   */
  private _tableConnectedListener = (
    event: CustomEvent<TableEventDetail>,
  ) => {
    const table = event.detail.table;
    this._attachTable(table);
  };

  /**
   * The `hdml-table:disconnected` event listener.
   */
  private _tableDisconnectedListener = (
    event: CustomEvent<TableEventDetail>,
  ) => {
    const table = event.detail.table;
    this._detachTable(table);
  };

  /**
   * The `hdml-model:changed` event listener.
   */
  private _tableChangedListener = (
    event: CustomEvent<TableEventDetail>,
  ) => {
    this._dispatchChangedEvent();
  };

  /**
   * Attaches `hdml-table` element to the tables map.
   */
  private _attachTable(table: TableElement) {
    if (!this._tables.has(table.uid)) {
      this._tables.set(table.uid, table);
      table.addEventListener(
        "hdml-table:changed",
        this._tableChangedListener,
      );
      this._dispatchChangedEvent();
    }
  }

  /**
   * Detaches `hdml-table` element from the tables map.
   */
  private _detachTable(table: TableElement) {
    if (this._tables.has(table.uid)) {
      table.removeEventListener(
        "hdml-table:changed",
        this._tableChangedListener,
      );
      this._tables.delete(table.uid);
      this._dispatchChangedEvent();
    }
  }

  /**
   * Dispatches the `hdml-model:changed` event.
   */
  private _dispatchChangedEvent(): void {
    this.dispatchEvent(
      new CustomEvent<ModelEventDetail>("hdml-model:changed", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          model: this,
        },
      }),
    );
  }
}

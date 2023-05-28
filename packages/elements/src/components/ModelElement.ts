/**
 * @fileoverview The `ModelElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { ModelData, TableData, JoinData } from "@hdml/schema";

import { MODEL_NAME_REGEXP } from "../helpers/constants";
import { getTableTag, getJoinTag } from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";
import { TableElement, TableEventDetail } from "./TableElement";
import { JoinElement, JoinEventDetail } from "./JoinElement";

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
   * Attached `hdml-join` elements map.
   */
  private _joins: Map<string, JoinElement> = new Map();

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
    this._watchJoins();
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
    this._unwatchJoins();
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
    super.disconnectedCallback();
  }

  /**
   * Component template.
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }

  /**
   * Initiates request.
   */
  public request(): void {
    this.dispatchEvent(
      new CustomEvent<ModelEventDetail>("hdml-model:request", {
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
    const joins: JoinData[] = [];
    this._joins.forEach((join) => {
      joins.push(join.toJSON());
    });
    return {
      name: this.name,
      host: "",
      tables,
      joins,
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
   * Starts watching for the `hdml-join` elements changes.
   */
  private _watchJoins(): void {
    this.querySelectorAll(getJoinTag()).forEach((join) => {
      this._attachJoin(<JoinElement>join);
    });
    this.addEventListener(
      "hdml-join:connected",
      this._joinConnectedListener,
    );
    this.addEventListener(
      "hdml-join:disconnected",
      this._joinDisconnectedListener,
    );
  }

  /**
   * Stops watching for the `hdml-table` elements changes.
   */
  private _unwatchTables(): void {
    this.removeEventListener(
      "hdml-table:connected",
      this._tableConnectedListener,
    );
    this.removeEventListener(
      "hdml-table:disconnected",
      this._tableDisconnectedListener,
    );
    this._tables.forEach((table) => {
      this._detachTable(table);
    });
    this._tables.clear();
  }

  /**
   * Stops watching for the `hdml-join` elements changes.
   */
  private _unwatchJoins(): void {
    this.removeEventListener(
      "hdml-join:connected",
      this._joinConnectedListener,
    );
    this.removeEventListener(
      "hdml-join:disconnected",
      this._joinDisconnectedListener,
    );
    this._joins.forEach((join) => {
      this._detachJoin(join);
    });
    this._joins.clear();
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
   * The `hdml-join:connected` event listener.
   */
  private _joinConnectedListener = (
    event: CustomEvent<JoinEventDetail>,
  ) => {
    const join = event.detail.join;
    this._attachJoin(join);
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
   * The `hdml-join:disconnected` event listener.
   */
  private _joinDisconnectedListener = (
    event: CustomEvent<JoinEventDetail>,
  ) => {
    const join = event.detail.join;
    this._detachJoin(join);
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
   * The `hdml-join:changed` event listener.
   */
  private _joinChangedListener = (
    event: CustomEvent<JoinEventDetail>,
  ) => {
    this._dispatchChangedEvent();
  };

  /**
   * Attaches `hdml-table` element to the tables map.
   */
  private _attachTable(table: TableElement) {
    if (table.uid && !this._tables.has(table.uid)) {
      this._tables.set(table.uid, table);
      table.addEventListener(
        "hdml-table:changed",
        this._tableChangedListener,
      );
      this._dispatchChangedEvent();
    }
  }

  /**
   * Attaches `hdml-join` element to the joins map.
   */
  private _attachJoin(join: JoinElement) {
    if (join.uid && !this._joins.has(join.uid)) {
      this._joins.set(join.uid, join);
      join.addEventListener(
        "hdml-join:changed",
        this._joinChangedListener,
      );
      this._dispatchChangedEvent();
    }
  }

  /**
   * Detaches `hdml-table` element from the tables map.
   */
  private _detachTable(table: TableElement) {
    if (table.uid && this._tables.has(table.uid)) {
      table.removeEventListener(
        "hdml-table:changed",
        this._tableChangedListener,
      );
      this._tables.delete(table.uid);
      this._dispatchChangedEvent();
    }
  }

  /**
   * Detaches `hdml-join` element from the joins map.
   */
  private _detachJoin(join: JoinElement) {
    if (join.uid && this._joins.has(join.uid)) {
      join.removeEventListener(
        "hdml-join:changed",
        this._joinChangedListener,
      );
      this._joins.delete(join.uid);
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

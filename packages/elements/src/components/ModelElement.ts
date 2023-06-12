/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { ModelDef, TableDef, JoinDef } from "@hdml/schema";
import { MODEL_NAME_REGEXP } from "../helpers/constants";
import { getTableTag, getJoinTag } from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";
import { TableElement, TableDetail } from "./TableElement";
import { JoinElement, JoinDetail } from "./JoinElement";

/**
 * `hdml-model:connected`, `hdml-model:changed`, `hdml-model:request`,
 * `hdml-model:disconnected` events details interface.
 */
export interface ModelDetail {
  model: ModelElement;
}

/**
 * `ModelElement` class. Adds an `HTML` tag (default `hdml-model`)
 * which is the root tag for describing the underlying query model.
 * This model is a set of tables and a set of their joins.
 */
export class ModelElement extends UnifiedElement {
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
  };

  /**
   * The `name` private property.
   */
  private _name: null | string = null;

  /**
   * A map of attached `TableElement` elements.
   */
  private _tables: Map<string, TableElement> = new Map();

  /**
   * A map of attached `JoinElement` elements.
   */
  private _joins: Map<string, JoinElement> = new Map();

  /**
   * The `name` setter.
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
   * The `name` getter.
   */
  public get name(): null | string {
    return this._name;
  }

  /**
   * The `ModelDef` object.
   */
  public get data(): ModelDef {
    if (!this.name) {
      throw new Error("A `name` property is required.");
    }
    const tables: TableDef[] = [];
    this._tables.forEach((table) => {
      tables.push(table.data);
    });
    const joins: JoinDef[] = [];
    this._joins.forEach((join) => {
      joins.push(join.data);
    });
    return {
      name: this.name,
      tables,
      joins,
    };
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    document.body.dispatchEvent(
      new CustomEvent<ModelDetail>("hdml-model:connected", {
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
      new CustomEvent<ModelDetail>("hdml-model:disconnected", {
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
   * Component renderer.
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }

  /**
   * Initializes a request by raising the `hdml-model:request` event.
   */
  public query(): void {
    this.dispatchEvent(
      new CustomEvent<ModelDetail>("hdml-model:request", {
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
   * Starts tracking changes to `TableElement` elements.
   */
  private _watchTables(): void {
    this.queryHdmlChildren<TableElement>(getTableTag()).forEach(
      (table) => {
        this._attachTable(table);
      },
    );
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
   * Starts tracking changes to `JoinElement` elements.
   */
  private _watchJoins(): void {
    this.queryHdmlChildren<JoinElement>(getJoinTag()).forEach(
      (join) => {
        this._attachJoin(join);
      },
    );
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
   * Stops watching for changes to `TableElement` elements.
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
   * Stops watching for changes to `JoinElement` elements.
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
   * `hdml-table:connected` event listener.
   */
  private _tableConnectedListener = (
    event: CustomEvent<TableDetail>,
  ) => {
    const table = event.detail.table;
    this._attachTable(table);
  };

  /**
   * `hdml-join:connected` event listener.
   */
  private _joinConnectedListener = (
    event: CustomEvent<JoinDetail>,
  ) => {
    const join = event.detail.join;
    this._attachJoin(join);
  };

  /**
   * `hdml-table:disconnected` event listener.
   */
  private _tableDisconnectedListener = (
    event: CustomEvent<TableDetail>,
  ) => {
    const table = event.detail.table;
    this._detachTable(table);
  };

  /**
   * `hdml-join:disconnected` event listener.
   */
  private _joinDisconnectedListener = (
    event: CustomEvent<JoinDetail>,
  ) => {
    const join = event.detail.join;
    this._detachJoin(join);
  };

  /**
   * `hdml-model:changed` event listener.
   */
  private _tableChangedListener = () => {
    this._dispatchChangedEvent();
  };

  /**
   * `hdml-join:changed` event listener.
   */
  private _joinChangedListener = () => {
    this._dispatchChangedEvent();
  };

  /**
   * Attaches a `TableElement` element to the tables map.
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
   * Attaches a `JoinElement` element to the joins map.
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
   * Detaches `TableElement` element from the tables map.
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
   * Detaches `JoinElement` element from the joins map.
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
      new CustomEvent<ModelDetail>("hdml-model:changed", {
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

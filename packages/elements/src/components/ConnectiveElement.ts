/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import {
  FilterOperator,
  FilterClauseDef,
  FilterDef,
} from "@hdml/schema";
import { CONNECTIVE_OP_REGEXP } from "../helpers/constants";
import {
  getJoinTag,
  getFilterByTag,
  getConnectiveTag,
  getFilterTag,
} from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";
import { FilterElement, FilterDetail } from "./FilterElement";

/**
 * `hdml-connective:connected`, `hdml-connective:changed`,
 * `hdml-connective:request`, `hdml-connective:disconnected` events
 * details interface.
 */
export interface ConnDetail {
  conn: ConnectiveElement;
}

/**
 * `ConnectiveElement` class.
 */
export class ConnectiveElement extends UnifiedElement {
  /**
   * Reactive attributes.
   */
  public static properties = {
    /**
     * The `operator` property definition.
     */
    operator: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },
  };

  /**
   * The `operator` private property.
   */
  private _operator: null | string = null;

  /**
   * The assosiated parent `ConnectiveElement`, `JoinElement`,
   * `FilterByElement` element.
   */
  private _parent: null | Element = null;

  /**
   * A map of attached `ConnectiveElement` elements.
   */
  private _connectives: Map<string, ConnectiveElement> = new Map();

  /**
   * A map of attached `FilterElement` elements.
   */
  private _filters: Map<string, FilterElement> = new Map();

  /**
   * The `operator` setter.
   */
  public set operator(val: null | string) {
    if (
      val === null ||
      val === "" ||
      CONNECTIVE_OP_REGEXP.test(val)
    ) {
      const old = this._operator;
      this._operator = val;
      this.requestUpdate("operator", old);
    } else {
      console.error(
        `The \`operator\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("operator") === val) {
        if (this._operator === null) {
          this.removeAttribute("operator");
        } else {
          this.setAttribute("operator", this._operator);
        }
      }
    }
  }

  /**
   * The `operator` getter.
   */
  public get operator(): null | string {
    return this._operator;
  }

  /**
   * The `FilterClauseDef` object.
   */
  public get data(): FilterClauseDef {
    if (!this.operator) {
      throw new Error("A `operator` property is required.");
    }
    const filters: FilterDef[] = [];
    this._filters.forEach((filter) => {
      filters.push(filter.data);
    });
    const children: FilterClauseDef[] = [];
    this._connectives.forEach((conn) => {
      children.push(conn.data);
    });
    return {
      type: this._getConnectiveOperator(this.operator),
      filters,
      children,
    };
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    this._parent = this._getParent();
    if (this._parent) {
      this._parent.dispatchEvent(
        new CustomEvent<ConnDetail>("hdml-connective:connected", {
          cancelable: false,
          composed: false,
          bubbles: false,
          detail: {
            conn: this,
          },
        }),
      );
    }
    this._watchFilters();
    this._watchConnectives();
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
    this._unwatchFilters();
    this._unwatchConnectives();
    if (this._parent) {
      this._parent.dispatchEvent(
        new CustomEvent<ConnDetail>("hdml-connective:disconnected", {
          cancelable: false,
          composed: false,
          bubbles: false,
          detail: {
            conn: this,
          },
        }),
      );
      this._parent = null;
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
   * Returns the assosiated parent element if exist or `null`
   * otherwise.
   */
  private _getParent(): null | Element {
    let element = this.parentElement;
    while (
      element &&
      element.tagName !== "BODY" &&
      element.tagName !== getJoinTag().toUpperCase() &&
      element.tagName !== getFilterByTag().toUpperCase() &&
      element.tagName !== getConnectiveTag().toUpperCase()
    ) {
      element = element.parentElement;
    }
    return element && element.tagName !== "BODY" ? element : null;
  }

  /**
   * Starts tracking changes to `FilterElement` elements.
   */
  private _watchFilters(): void {
    this.queryHdmlChildren<FilterElement>(getFilterTag()).forEach(
      (filter) => {
        this._attachFilter(filter);
      },
    );
    this.addEventListener(
      "hdml-filter:connected",
      this._filterConnectedListener,
    );
    this.addEventListener(
      "hdml-filter:disconnected",
      this._filterDisconnectedListener,
    );
  }

  /**
   * Starts tracking changes to `ConnectiveElement` elements.
   */
  private _watchConnectives(): void {
    this.queryHdmlChildren<ConnectiveElement>(
      getConnectiveTag(),
    ).forEach((conn) => {
      this._attachConnective(conn);
    });
    this.addEventListener(
      "hdml-connective:connected",
      this._connectiveConnectedListener,
    );
    this.addEventListener(
      "hdml-connective:disconnected",
      this._connectiveDisconnectedListener,
    );
  }

  /**
   * Stops watching for changes to `FilterElement` elements.
   */
  private _unwatchFilters(): void {
    this.removeEventListener(
      "hdml-filter:connected",
      this._filterConnectedListener,
    );
    this.removeEventListener(
      "hdml-filter:disconnected",
      this._filterDisconnectedListener,
    );
    this._filters.forEach((filter) => {
      this._detachFilter(filter);
    });
    this._filters.clear();
  }

  /**
   * Stops watching for changes to `ConnectiveElement` elements.
   */
  private _unwatchConnectives(): void {
    this.removeEventListener(
      "hdml-connective:connected",
      this._connectiveConnectedListener,
    );
    this.removeEventListener(
      "hdml-connective:disconnected",
      this._connectiveDisconnectedListener,
    );
    this._connectives.forEach((conn) => {
      this._detachConnective(conn);
    });
    this._connectives.clear();
  }

  /**
   * `hdml-filter:connected` event listener.
   */
  private _filterConnectedListener = (
    event: CustomEvent<FilterDetail>,
  ) => {
    const filter = event.detail.filter;
    this._attachFilter(filter);
  };

  /**
   * `hdml-connective:connected` event listener.
   */
  private _connectiveConnectedListener = (
    event: CustomEvent<ConnDetail>,
  ) => {
    const conn = event.detail.conn;
    this._attachConnective(conn);
  };

  /**
   * `hdml-filter:disconnected` event listener.
   */
  private _filterDisconnectedListener = (
    event: CustomEvent<FilterDetail>,
  ) => {
    const filter = event.detail.filter;
    this._detachFilter(filter);
  };

  /**
   * `hdml-connective:disconnected` event listener.
   */
  private _connectiveDisconnectedListener = (
    event: CustomEvent<ConnDetail>,
  ) => {
    const conn = event.detail.conn;
    this._detachConnective(conn);
  };

  /**
   * `hdml-filter:changed` event listener.
   */
  private _filterChangedListener = () => {
    this._dispatchChangedEvent();
  };

  /**
   * `hdml-connective:changed` event listener.
   */
  private _connectiveChangedListener = () => {
    this._dispatchChangedEvent();
  };

  /**
   * Attaches a `FilterElement` element to the filters map.
   */
  private _attachFilter(filter: FilterElement) {
    if (filter.uid && !this._filters.has(filter.uid)) {
      this._filters.set(filter.uid, filter);
      filter.addEventListener(
        "hdml-filter:changed",
        this._filterChangedListener,
      );
      this._dispatchChangedEvent();
    }
  }

  /**
   * Attaches a `ConnectiveElement` element to the connectives map.
   */
  private _attachConnective(conn: ConnectiveElement) {
    if (conn.uid && !this._connectives.has(conn.uid)) {
      this._connectives.set(conn.uid, conn);
      conn.addEventListener(
        "hdml-connective:changed",
        this._connectiveChangedListener,
      );
      this._dispatchChangedEvent();
    }
  }

  /**
   * Detaches `FilterElement` element from the filters map.
   */
  private _detachFilter(filter: FilterElement) {
    if (filter.uid && this._filters.has(filter.uid)) {
      filter.removeEventListener(
        "hdml-filter:changed",
        this._filterChangedListener,
      );
      this._filters.delete(filter.uid);
      this._dispatchChangedEvent();
    }
  }

  /**
   * Detaches `ConnectiveElement` element from the connectives map.
   */
  private _detachConnective(conn: ConnectiveElement) {
    if (conn.uid && this._connectives.has(conn.uid)) {
      conn.removeEventListener(
        "hdml-connective:changed",
        this._connectiveChangedListener,
      );
      this._connectives.delete(conn.uid);
      this._dispatchChangedEvent();
    }
  }

  /**
   * Dispatches the `hdml-connective:changed` event.
   */
  private _dispatchChangedEvent(): void {
    this.dispatchEvent(
      new CustomEvent<ConnDetail>("hdml-connective:changed", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          conn: this,
        },
      }),
    );
  }

  /**
   * Converts a `operator` property to a `FilterOperator` enum.
   */
  private _getConnectiveOperator(op: string): FilterOperator {
    switch (op) {
      case "or":
        return FilterOperator.Or;
      case "and":
        return FilterOperator.And;
      case "none":
        return FilterOperator.None;
      default:
        throw new Error(`Unsupported connective operator "${op}".`);
    }
  }
}

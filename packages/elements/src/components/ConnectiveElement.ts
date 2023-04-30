/**
 * @fileoverview The `ConnectiveElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { FilterOperator, FilterClauseData } from "@hdml/schema";

import "../events";
import { CONNECTIVE_OP_REGEXP } from "../helpers/constants";
import {
  getJoinTag,
  getConnectiveTag,
} from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";

/**
 * An `hdml-connective` element event detail interface.
 */
export interface ConnEventDetail {
  conn: ConnectiveElement;
}

/**
 * The `ConnectiveElement` class.
 */
export class ConnectiveElement extends UnifiedElement {
  /**
   * Reactive attributes.
   */
  public static properties = {
    /**
     * A `operator` property definition.
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
   * A `operator` private property.
   */
  private _operator: null | string = null;

  /**
   * An assosiated `hdml-connective`, `hdml-join`, `hdml-filter-by`
   * element.
   */
  private _parent: null | Element = null;

  /**
   * Attached `hdml-connective` elements map.
   */
  private _connectives: Map<string, ConnectiveElement> = new Map();

  /**
   * A `operator` setter.
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
   * A `operator` getter.
   */
  public get operator(): null | string {
    return this._operator;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    this._parent = this._getParent();
    if (this._parent) {
      this._parent.dispatchEvent(
        new CustomEvent<ConnEventDetail>(
          "hdml-connective:connected",
          {
            cancelable: false,
            composed: false,
            bubbles: false,
            detail: {
              conn: this,
            },
          },
        ),
      );
    }
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
    this._unwatchConnectives();
    if (this._parent) {
      this._parent.dispatchEvent(
        new CustomEvent<ConnEventDetail>(
          "hdml-connective:disconnected",
          {
            cancelable: false,
            composed: false,
            bubbles: false,
            detail: {
              conn: this,
            },
          },
        ),
      );
      this._parent = null;
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
   * Returns connective `JSON`-representation.
   */
  public toJSON(): FilterClauseData {
    if (!this.operator) {
      throw new Error("A `operator` property is required.");
    }
    const children: FilterClauseData[] = [];
    this._connectives.forEach((conn) => {
      children.push(conn.toJSON());
    });
    return {
      type: this._getConnectiveOperator(this.operator),
      filters: [],
      children,
    };
  }

  /**
   * Returns assosiated parent element if exist or null
   * otherwise.
   */
  private _getParent(): null | Element {
    let element = this.parentElement;
    while (
      element &&
      element.tagName !== "BODY" &&
      element.tagName !== getJoinTag().toUpperCase() &&
      element.tagName !== getConnectiveTag().toUpperCase()
    ) {
      element = this.parentElement;
    }
    return element && element.tagName !== "BODY" ? element : null;
  }

  /**
   * Starts watching for the `hdml-connective` elements changes.
   */
  private _watchConnectives(): void {
    this.querySelectorAll(getConnectiveTag()).forEach((conn) => {
      this._attachConnective(<ConnectiveElement>conn);
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
   * Stops watching for the `hdml-connective` elements changes.
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
   * The `hdml-connective:connected` event listener.
   */
  private _connectiveConnectedListener = (
    event: CustomEvent<ConnEventDetail>,
  ) => {
    const conn = event.detail.conn;
    this._attachConnective(conn);
  };

  /**
   * The `hdml-connective:disconnected` event listener.
   */
  private _connectiveDisconnectedListener = (
    event: CustomEvent<ConnEventDetail>,
  ) => {
    const conn = event.detail.conn;
    this._detachConnective(conn);
  };

  /**
   * The `hdml-connective:changed` event listener.
   */
  private _connectiveChangedListener = (
    event: CustomEvent<ConnEventDetail>,
  ) => {
    this._dispatchChangedEvent();
  };

  /**
   * Attaches `hdml-connective` element to the connectives map.
   */
  private _attachConnective(conn: ConnectiveElement) {
    if (!this._connectives.has(conn.uid)) {
      this._connectives.set(conn.uid, conn);
      conn.addEventListener(
        "hdml-connective:changed",
        this._connectiveChangedListener,
      );
      this._dispatchChangedEvent();
    }
  }

  /**
   * Detaches `hdml-connective` element from the connectives map.
   */
  private _detachConnective(conn: ConnectiveElement) {
    if (this._connectives.has(conn.uid)) {
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
      new CustomEvent<ConnEventDetail>("hdml-connective:changed", {
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
   * Converts `operator` property to a `FilterOperator` enum.
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

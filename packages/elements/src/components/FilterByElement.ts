/**
 * @fileoverview The `FilterByElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { FilterClauseData, FilterOperator } from "@hdml/schema";

import {
  getFrameTag,
  getConnectiveTag,
} from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";
import {
  ConnectiveElement,
  ConnEventDetail,
} from "./ConnectiveElement";

/**
 * An `hdml-filter-by` element event detail interface.
 */
export interface FilterByEventDetail {
  filterBy: FilterByElement;
}

/**
 * The `FilterByElement` class.
 */
export class FilterByElement extends UnifiedElement {
  /**
   * An assosiated `hdml-frame` element.
   */
  private _frame: null | Element = null;

  /**
   * An assosiated `hdml-connective` element.
   */
  private _connective: null | ConnectiveElement = null;

  /**
   * The `FilterClauseData` object.
   */
  public get data(): FilterClauseData {
    const clause = this._connective
      ? this._connective.data
      : {
          type: FilterOperator.None,
          filters: [],
          children: [],
        };
    return clause;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    this._frame = this._getFrame();
    if (this._frame) {
      this._frame.dispatchEvent(
        new CustomEvent<FilterByEventDetail>(
          "hdml-filter-by:connected",
          {
            cancelable: false,
            composed: false,
            bubbles: false,
            detail: {
              filterBy: this,
            },
          },
        ),
      );
    }
    this._watchConnective();
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
    this._unwatchConnective();
    if (this._frame) {
      this._frame.dispatchEvent(
        new CustomEvent<FilterByEventDetail>(
          "hdml-filter-by:disconnected",
          {
            cancelable: false,
            composed: false,
            bubbles: false,
            detail: {
              filterBy: this,
            },
          },
        ),
      );
      this._frame = null;
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
   * Returns assosiated `hdml-frame` element if exist or null
   * otherwise.
   */
  private _getFrame(): null | Element {
    let element = this.parentElement;
    while (
      element &&
      element.tagName !== "BODY" &&
      element.tagName !== getFrameTag().toUpperCase()
    ) {
      element = element.parentElement;
    }
    return element && element.tagName !== "BODY" ? element : null;
  }

  /**
   * Starts watching for the `hdml-connective` elements changes.
   */
  private _watchConnective(): void {
    const conn = <ConnectiveElement>(
      this.querySelector(getConnectiveTag())
    );
    if (conn) {
      this._attachConnective(conn);
    }
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
  private _unwatchConnective(): void {
    this.removeEventListener(
      "hdml-connective:connected",
      this._connectiveConnectedListener,
    );
    this.removeEventListener(
      "hdml-connective:disconnected",
      this._connectiveDisconnectedListener,
    );
    this._detachConnective();
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
    this._detachConnective();
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
   * Attaches `hdml-connective` element.
   */
  private _attachConnective(conn: ConnectiveElement) {
    if (!this._connective) {
      this._connective = conn;
      this._connective.addEventListener(
        "hdml-connective:changed",
        this._connectiveChangedListener,
      );
      this._dispatchChangedEvent();
    }
  }

  /**
   * Detaches `hdml-connective` element.
   */
  private _detachConnective() {
    if (this._connective) {
      this._connective.removeEventListener(
        "hdml-connective:changed",
        this._connectiveChangedListener,
      );
      this._connective = null;
      this._dispatchChangedEvent();
    }
  }

  /**
   * Dispatches the `hdml-filter-by:changed` event.
   */
  private _dispatchChangedEvent(): void {
    this.dispatchEvent(
      new CustomEvent<FilterByEventDetail>("hdml-filter-by:changed", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          filterBy: this,
        },
      }),
    );
  }
}

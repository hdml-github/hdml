/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { FilterClauseDef, FilterOperator } from "@hdml/schema";
import {
  getFrameTag,
  getConnectiveTag,
} from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";
import { ConnectiveElement, ConnDetail } from "./ConnectiveElement";

/**
 * `hdml-filter-by:connected`, `hdml-filter-by:changed`,
 * `hdml-filter-by:request`, `hdml-filter-by:disconnected` events
 * details interface.
 */
export interface FilterByDetail {
  filterBy: FilterByElement;
}

/**
 * `FilterByElement` class. Adds an `HTML` tag (default
 * `hdml-filter-by`), which is the root element for adding data frame
 * filtering.
 */
export class FilterByElement extends UnifiedElement {
  /**
   * The assosiated `FrameElement` element.
   */
  private _frame: null | Element = null;

  /**
   * The assosiated `ConnectiveElement` element.
   */
  private _connective: null | ConnectiveElement = null;

  /**
   * The `FilterClauseDef` object.
   */
  public get data(): FilterClauseDef {
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
        new CustomEvent<FilterByDetail>("hdml-filter-by:connected", {
          cancelable: false,
          composed: false,
          bubbles: false,
          detail: {
            filterBy: this,
          },
        }),
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
        new CustomEvent<FilterByDetail>(
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
   * Component renderer.
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }

  /**
   * Returns the associated `FrameElement` element if it exists,
   * or `null` otherwise.
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
   * Starts tracking changes to `ConnectiveElement` element.
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
   * Stops watching for changes to `ConnectiveElement` element.
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
   * `hdml-connective:connected` event listener.
   */
  private _connectiveConnectedListener = (
    event: CustomEvent<ConnDetail>,
  ) => {
    const conn = event.detail.conn;
    this._attachConnective(conn);
  };

  /**
   * `hdml-connective:disconnected` event listener.
   */
  private _connectiveDisconnectedListener = () => {
    this._detachConnective();
  };

  /**
   * `hdml-connective:changed` event listener.
   */
  private _connectiveChangedListener = () => {
    this._dispatchChangedEvent();
  };

  /**
   * Attaches a `ConnectiveElement` element.
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
   * Detaches a `ConnectiveElement` element.
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
      new CustomEvent<FilterByDetail>("hdml-filter-by:changed", {
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

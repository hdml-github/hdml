/**
 * @fileoverview The `SortByElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { FieldData } from "@hdml/schema";

import {
  getFieldTag,
  getFrameTag,
} from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";
import { FieldElement, FieldEventDetail } from "./FieldElement";

/**
 * An `hdml-sort-by` element event detail interface.
 */
export interface SortByEventDetail {
  sortBy: SortByElement;
}

/**
 * The `SortByElement` class.
 */
export class SortByElement extends UnifiedElement {
  /**
   * An assosiated `hdml-frame` element.
   */
  private _frame: null | Element = null;

  /**
   * Attached `hdml-field` elements map.
   */
  private _fields: Map<string, FieldElement> = new Map();

  /**
   * The `FieldData` objects array.
   */
  public get data(): FieldData[] {
    const fields: FieldData[] = [];
    this._fields.forEach((field) => {
      fields.push(field.data);
    });
    return fields;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    this._frame = this._getFrame();
    if (this._frame) {
      this._frame.dispatchEvent(
        new CustomEvent<SortByEventDetail>("hdml-sort-by:connected", {
          cancelable: false,
          composed: false,
          bubbles: false,
          detail: {
            sortBy: this,
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
    if (this._frame) {
      this._frame.dispatchEvent(
        new CustomEvent<SortByEventDetail>(
          "hdml-sort-by:disconnected",
          {
            cancelable: false,
            composed: false,
            bubbles: false,
            detail: {
              sortBy: this,
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
   * Starts watching for the `hdml-field` elements changes.
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
   * Stops watching for the `hdml-field` elements changes.
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
   * The `hdml-field:connected` event listener.
   */
  private _fieldConnectedListener = (
    event: CustomEvent<FieldEventDetail>,
  ) => {
    const field = event.detail.field;
    this._attachField(field);
  };

  /**
   * The `hdml-field:disconnected` event listener.
   */
  private _fieldDisconnectedListener = (
    event: CustomEvent<FieldEventDetail>,
  ) => {
    const field = event.detail.field;
    this._detachField(field);
  };

  /**
   * The `hdml-field:changed` event listener.
   */
  private _fieldChangedListener = (
    event: CustomEvent<FieldEventDetail>,
  ) => {
    this._dispatchChangedEvent();
  };

  /**
   * Attaches `hdml-field` element to the fields map.
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
   * Detaches `hdml-field` element from the fields map.
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
   * Dispatches the `hdml-sort-by:changed` event.
   */
  private _dispatchChangedEvent(): void {
    this.dispatchEvent(
      new CustomEvent<SortByEventDetail>("hdml-sort-by:changed", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          sortBy: this,
        },
      }),
    );
  }
}

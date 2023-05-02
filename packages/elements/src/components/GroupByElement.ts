/**
 * @fileoverview The `GroupByElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { FieldData } from "@hdml/schema";

import "../events";
import {
  getFieldTag,
  getFrameTag,
} from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";
import { FieldElement, FieldEventDetail } from "./FieldElement";

/**
 * An `hdml-group-by` element event detail interface.
 */
export interface GroupByEventDetail {
  groupBy: GroupByElement;
}

/**
 * The `GroupByElement` class.
 */
export class GroupByElement extends UnifiedElement {
  /**
   * An assosiated `hdml-frame` element.
   */
  private _frame: null | Element = null;

  /**
   * Attached `hdml-field` elements map.
   */
  private _fields: Map<string, FieldElement> = new Map();

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    this._frame = this._getFrame();
    if (this._frame) {
      this._frame.dispatchEvent(
        new CustomEvent<GroupByEventDetail>(
          "hdml-group-by:connected",
          {
            cancelable: false,
            composed: false,
            bubbles: false,
            detail: {
              groupBy: this,
            },
          },
        ),
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
        new CustomEvent<GroupByEventDetail>(
          "hdml-group-by:disconnected",
          {
            cancelable: false,
            composed: false,
            bubbles: false,
            detail: {
              groupBy: this,
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
   * Returns frame `JSON`-representation.
   */
  public toJSON(): FieldData[] {
    const fields: FieldData[] = [];
    this._fields.forEach((field) => {
      fields.push(field.toJSON());
    });
    return fields;
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
    this.querySelectorAll(getFieldTag()).forEach((field) => {
      this._attachField(<FieldElement>field);
    });
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
    if (!this._fields.has(field.uid)) {
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
    if (this._fields.has(field.uid)) {
      field.removeEventListener(
        "hdml-field:changed",
        this._fieldChangedListener,
      );
      this._fields.delete(field.uid);
      this._dispatchChangedEvent();
    }
  }

  /**
   * Dispatches the `hdml-group-by:changed` event.
   */
  private _dispatchChangedEvent(): void {
    this.dispatchEvent(
      new CustomEvent<GroupByEventDetail>("hdml-group-by:changed", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          groupBy: this,
        },
      }),
    );
  }
}

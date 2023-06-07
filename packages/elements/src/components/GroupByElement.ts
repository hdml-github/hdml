/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { FieldDef } from "@hdml/schema";
import {
  getFieldTag,
  getFrameTag,
} from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";
import { FieldElement, FieldDetail } from "./FieldElement";

/**
 * `hdml-group-by:connected`, `hdml-group-by:changed`,
 * `hdml-group-by:request`, `hdml-group-by:disconnected` events
 * details interface.
 */
export interface GroupByDetail {
  groupBy: GroupByElement;
}

/**
 * `GroupByElement` class. Adds a new `HTML` tag (default
 * `hdml-group-by`) which is the root element to describe the grouping
 * of the data frame. Contains a list of fields by which grouping will
 * be performed.
 */
export class GroupByElement extends UnifiedElement {
  /**
   * The assosiated `FrameElement` element.
   */
  private _frame: null | Element = null;

  /**
   * A map of attached `FieldElement` elements.
   */
  private _fields: Map<string, FieldElement> = new Map();

  /**
   * The `FieldDef` objects array.
   */
  public get data(): FieldDef[] {
    const fields: FieldDef[] = [];
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
        new CustomEvent<GroupByDetail>("hdml-group-by:connected", {
          cancelable: false,
          composed: false,
          bubbles: false,
          detail: {
            groupBy: this,
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
        new CustomEvent<GroupByDetail>("hdml-group-by:disconnected", {
          cancelable: false,
          composed: false,
          bubbles: false,
          detail: {
            groupBy: this,
          },
        }),
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
   * Returns the associated `FrameElement` element if it exists, or
   * `null` otherwise.
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
   * Starts tracking changes to `FieldElement` elements.
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
   * Stops watching for changes to `FieldElement` elements.
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
   * `hdml-field:connected` event listener.
   */
  private _fieldConnectedListener = (
    event: CustomEvent<FieldDetail>,
  ) => {
    const field = event.detail.field;
    this._attachField(field);
  };

  /**
   * `hdml-field:disconnected` event listener.
   */
  private _fieldDisconnectedListener = (
    event: CustomEvent<FieldDetail>,
  ) => {
    const field = event.detail.field;
    this._detachField(field);
  };

  /**
   * `hdml-field:changed` event listener.
   */
  private _fieldChangedListener = () => {
    this._dispatchChangedEvent();
  };

  /**
   * Attaches a `FieldElement` element to the fields map.
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
   * Detaches `FieldElement` element from the fields map.
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
   * Dispatches the `hdml-group-by:changed` event.
   */
  private _dispatchChangedEvent(): void {
    this.dispatchEvent(
      new CustomEvent<GroupByDetail>("hdml-group-by:changed", {
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

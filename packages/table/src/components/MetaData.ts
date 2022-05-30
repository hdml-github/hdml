/**
 * @fileoverview `MetaData` class definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { NamedElement } from "@hdml/element";
import { MetaDataSchema } from "../schemas/MetaData.schema";

export type MetaDataType = {
  uid: string;
  name: string;
  content: string;
};

export class MetaData extends NamedElement {
  /**
   * Reactive attributes.
   */
  public static properties = {
    ...NamedElement.properties,
    content: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },
  };

  private _content = "";
  private _namedElement: null | NamedElement = null;

  /**
   * Content attribute/property setter.
   */
  public set content(val: string) {
    const old = this._content;
    this._content = val;
    this.requestUpdate("content", old);
  }

  /**
   * Content attribute/property getter.
   */
  public get content(): string {
    return this._content;
  }

  /**
   * Class constructor.
   */
  public constructor() {
    super(MetaDataSchema);
  }

  /**
   * @override
   */
  protected serializeInternal(): MetaDataType {
    return {
      uid: this.uid,
      name: this.name,
      content: this.content,
    };
  }

  /**
   * Link meta-data with data-field or hdml-schema.
   */
  public attachNamedElement(element: NamedElement): void {
    this._namedElement = element;
  }

  /**
   * @override
   */
  public serialize(): false | MetaDataType {
    return super.serialize() as false | MetaDataType;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    if (!this.getAttribute("content")) {
      console.warn("`content` attribute is required for:", this);
    }
    this.dispatchEvent(
      new Event("meta-data-connected", { bubbles: true }),
    );
  }

  /**
   * @override
   */
  public attributechangedcallback(
    name: string,
    old: string,
    value: string,
  ): void {
    super.attributeChangedCallback(name, old, value);
    this.dispatchEvent(
      new Event("meta-data-changed", { bubbles: false }),
    );
  }

  /**
   * @override
   */
  public disconnectedcallback(): void {
    super.disconnectedCallback();
    if (this._namedElement) {
      this._namedElement.dispatchEvent(
        new Event("meta-data-disconnected", { bubbles: false }),
      );
      this._namedElement = null;
    }
  }
}

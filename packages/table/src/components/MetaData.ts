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
  }
}

/**
 * @fileoverview `HdmlSchema` class definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { debounce } from "debounce";
import { lit, NamedElement } from "@hdml/element";
import { HdmlSchemaSchema } from "../schemas/HdmlSchema.schema";
import { MetaData, MetaDataType } from "./MetaData";
import { DataField, DataFieldType } from "./DataField";

export type HdmlSchemaType = {
  uid: string;
  name: string;
  fields: { [name: string]: DataFieldType };
  metadata?: { [name: string]: MetaDataType };
  index?: string;
};

export class HdmlSchema extends NamedElement {
  /**
   * Reactive attributes.
   */
  public static properties = {
    ...NamedElement.properties,
    index: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },
  };

  private _index = "";

  /**
   * Index attribute/property setter.
   */
  public set index(val: string) {
    const old = this._index;
    this._index = val;
    this.requestUpdate("index", old);
  }

  /**
   * Index attribute/property getter.
   */
  public get index(): string {
    return this._index;
  }

  /**
   * Class constructor.
   */
  public constructor() {
    super(HdmlSchemaSchema);
  }

  /**
   * Returns metadata object.
   */
  private _getMetadata(): { [name: string]: MetaDataType } {
    const metadata: { [name: string]: MetaDataType } = {};
    this.querySelectorAll("hdml-schema > meta-data").forEach(
      (element) => {
        if (element.parentNode === this) {
          const meta = (element as MetaData).serialize();
          if (meta) metadata[meta.name] = meta;
        }
      },
    );
    return metadata;
  }

  /**
   * Returns fields object.
   */
  private _getFields(): { [name: string]: DataFieldType } {
    const fields: { [name: string]: DataFieldType } = {};
    this.querySelectorAll("hdml-schema > data-field").forEach(
      (element) => {
        if (element.parentNode === this) {
          const field = (element as DataField).serialize();
          if (field) fields[field.name] = field;
        }
      },
    );
    return fields;
  }

  /**
   * @override
   */
  protected serializeInternal(): HdmlSchemaType {
    const obj: HdmlSchemaType = {
      uid: this.uid,
      name: this.name,
      fields: this._getFields(),
    };
    if (this.index.length) obj.index = this.index;
    if (Object.keys(this._getMetadata()).length > 0)
      obj.metadata = this._getMetadata();
    return obj;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
  }

  /**
   * Component template.
   */
  public render(): lit.TemplateResult<1> {
    return lit.html`<slot></slot>`;
  }
}

/**
 * @fileoverview `HdmlSchema` class definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { debounce } from "debounce";
import { arrow } from "@hdml/database";
import { lit, NamedElement } from "@hdml/element";
import { HdmlSchemaSchema } from "../schemas/HdmlSchema.schema";
import {
  getDataType,
  getHdmlSchemaTagName,
  getDataFieldTagName,
  getMetaDataTagName,
} from "../services";
import { MetaData, MetaDataType } from "./MetaData";
import { DataField, DataFieldType } from "./DataField";
import {
  DatafieldConnected,
  DatafieldChanged,
  DatafieldDisconnected,
  MetadataConnected,
  MetadataChanged,
  MetadataDisconnected,
} from "../events";

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
   * MetadataConnected event listener.
   */
  private _metadataConnectedListener(event: MetadataConnected) {
    event.stopPropagation();
    event.target.attachNamedElement(this);
    this._compile();
  }

  /**
   * MetadataChanged event listener.
   */
  private _metadataChangedListener(event: MetadataChanged) {
    event.stopPropagation();
    this._compile();
  }

  /**
   * MetadataDisonnected event listener.
   */
  private _metadataDisconnectedListener(event: MetadataDisconnected) {
    event.stopPropagation();
    this._compile();
  }

  /**
   * DatafieldConnected event listener.
   */
  private _datafieldConnectedListener(event: DatafieldConnected) {
    event.stopPropagation();
    event.target.attachHdmlSchema(this);
    this._compile();
  }

  /**
   * DatafieldChanged event listener.
   */
  private _datafieldChangedListener(event: DatafieldChanged) {
    event.stopPropagation();
    this._compile();
  }

  /**
   * DatafieldDisconnected event listener.
   */
  private _datafieldDisconnectedListener(
    event: DatafieldDisconnected,
  ) {
    event.stopPropagation();
    this._compile();
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
    this.querySelectorAll(
      `${getHdmlSchemaTagName()} > ${getDataFieldTagName()}`,
    ).forEach((element) => {
      if (element.parentNode === this) {
        const field = (element as DataField).serialize();
        if (field) fields[field.name] = field;
      }
    });
    return fields;
  }

  private _compileField(field: DataFieldType): false | arrow.Field {
    const datatype = getDataType(field);
    if (datatype) {
      const nullable =
        field.nullable && field.nullable.length > 0 ? true : false;
      const metadata: Map<string, string> = new Map();
      if (field.metadata) {
        const meta = field.metadata as {
          [name: string]: MetaDataType;
        };
        Object.keys(meta).forEach((key: string) => {
          metadata.set(key, meta[key].content);
        });
      }
      return new arrow.Field(
        field.name,
        datatype,
        nullable,
        metadata,
      );
    } else {
      return false;
    }
  }

  private _compileSchema(): void {
    const data = this.serialize();
    if (data) {
      const fields: arrow.Field[] = [];
      Object.keys(data.fields).forEach((key) => {
        const f = this._compileField(data.fields[key]);
        if (f) fields.push(f);
      });
      const metadata: Map<string, string> = new Map();
      if (data.metadata) {
        const meta = data.metadata as {
          [name: string]: MetaDataType;
        };
        Object.keys(meta).forEach((key: string) => {
          metadata.set(key, meta[key].content);
        });
      }
      const schema = new arrow.Schema(fields, metadata, null);
      console.log(schema);
    }
  }

  private _compile: (() => void) & {
    clear(): void;
  } & {
    flush(): void;
  } = debounce(this._compileSchema, 25, false);

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
  public serialize(): false | HdmlSchemaType {
    return super.serialize() as false | HdmlSchemaType;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener(
      "meta-data-connected",
      this._metadataConnectedListener,
    );
    this.addEventListener(
      "meta-data-changed",
      this._metadataChangedListener,
    );
    this.addEventListener(
      "meta-data-disconnected",
      this._metadataDisconnectedListener,
    );
    this.addEventListener(
      "data-field-connected",
      this._datafieldConnectedListener,
    );
    this.addEventListener(
      "data-field-changed",
      this._datafieldChangedListener,
    );
    this.addEventListener(
      "data-field-disconnected",
      this._datafieldDisconnectedListener,
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
  }

  /**
   * @override
   */
  public disconnectedcallback(): void {
    super.disconnectedCallback();
    this.removeEventListener(
      "meta-data-connected",
      this._metadataConnectedListener,
    );
    this.removeEventListener(
      "meta-data-changed",
      this._metadataChangedListener,
    );
    this.removeEventListener(
      "meta-data-disconnected",
      this._metadataDisconnectedListener,
    );
    this.removeEventListener(
      "data-field-connected",
      this._datafieldConnectedListener,
    );
    this.removeEventListener(
      "data-field-changed",
      this._datafieldChangedListener,
    );
    this.removeEventListener(
      "data-field-disconnected",
      this._datafieldDisconnectedListener,
    );
  }

  /**
   * Component template.
   */
  public render(): lit.TemplateResult<1> {
    return lit.html`<slot></slot>`;
  }
}

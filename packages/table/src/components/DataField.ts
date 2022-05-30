/**
 * @fileoverview `DataField` class definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit, NamedElement } from "@hdml/element";
import { MetaData, MetaDataType } from "./MetaData";
import { DataFieldSchema } from "../schemas/DataField.schema";
import {
  MetadataConnected,
  MetadataChanged,
  MetadataDisconnected,
} from "../events";

export type DataFieldType = {
  uid: string;
  name: string;
  type: string;
  metadata?: { [name: string]: MetaDataType };
  nullable?: string;
  scale?: number;
  precision?: number;
  bitWidth?: number;
  unit?: string;
  timezone?: string;
};

/**
 * `DataField` class.
 */
export class DataField extends NamedElement {
  /**
   * Reactive attributes.
   */
  public static properties = {
    ...NamedElement.properties,
    type: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },
    nullable: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },
    scale: {
      type: Number,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },
    precision: {
      type: Number,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },
    bitWidth: {
      type: Number,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },
    unit: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },
    timezone: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },
  };

  private _type = "";
  private _nullable = "";
  private _scale = NaN;
  private _precision = NaN;
  private _bitWidth = NaN;
  private _unit = "";
  private _timezone = "";
  private _hdmlSchema: null | NamedElement = null;

  /**
   * Type attribute/property setter.
   */
  public set type(val: string) {
    const old = this._type;
    this._type = val;
    this.requestUpdate("type", old);
  }

  /**
   * Type attribute/property getter.
   */
  public get type(): string {
    return this._type;
  }

  /**
   * Nullable attribute/property setter.
   */
  public set nullable(val: string) {
    const old = this._nullable;
    this._nullable = val;
    this.requestUpdate("nullable", old);
  }

  /**
   * Nullable attribute/property getter.
   */
  public get nullable(): string {
    return this._nullable;
  }

  /**
   * Scale attribute/property setter.
   */
  public set scale(val: number) {
    const old = this._scale;
    this._scale = val;
    this.requestUpdate("scale", old);
  }

  /**
   * Scale attribute/property getter.
   */
  public get scale(): number {
    return this._scale;
  }

  /**
   * Precision attribute/property setter.
   */
  public set precision(val: number) {
    const old = this._precision;
    this._precision = val;
    this.requestUpdate("precision", old);
  }

  /**
   * Precision attribute/property getter.
   */
  public get precision(): number {
    return this._precision;
  }

  /**
   * Bit width attribute/property setter.
   */
  public set bitWidth(val: number) {
    const old = this._bitWidth;
    this._bitWidth = val;
    this.requestUpdate("bitWidth", old);
  }

  /**
   * Bit width attribute/property getter.
   */
  public get bitWidth(): number {
    return this._bitWidth;
  }

  /**
   * Unit attribute/property setter.
   */
  public set unit(val: string) {
    const old = this._unit;
    this._unit = val;
    this.requestUpdate("unit", old);
  }

  /**
   * Unit attribute/property getter.
   */
  public get unit(): string {
    return this._unit;
  }

  /**
   * Timezone attribute/property setter.
   */
  public set timezone(val: string) {
    const old = this._timezone;
    this._timezone = val;
    this.requestUpdate("timezone", old);
  }

  /**
   * Timezone attribute/property getter.
   */
  public get timezone(): string {
    return this._timezone;
  }

  /**
   * Class constructor.
   */
  public constructor() {
    super(DataFieldSchema);
  }

  /**
   * Returns metadata object.
   */
  private _getMetadata(): { [name: string]: MetaDataType } {
    const metadata: { [name: string]: MetaDataType } = {};
    this.querySelectorAll("data-field > meta-data").forEach(
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
   * MetadataConnected event listener.
   */
  private _metadataConnectedListener(event: MetadataConnected) {
    event.stopPropagation();
    event.target.attachNamedElement(this);
  }

  /**
   * MetadataChanged event listener.
   */
  private _metadataChangedListener(event: MetadataChanged) {
    event.stopPropagation();
    this.dispatchEvent(
      new Event("data-field-changed", { bubbles: false }),
    );
  }

  /**
   * MetadataDisonnected event listener.
   */
  private _metadataDisconnectedListener(event: MetadataDisconnected) {
    event.stopPropagation();
  }

  /**
   * @override
   */
  protected serializeInternal(): DataFieldType {
    const obj: DataFieldType = {
      uid: this.uid,
      name: this.name,
      type: this.type,
    };
    if (this.unit.length) obj.unit = this.unit;
    if (this.nullable.length) obj.nullable = this.nullable;
    if (this.timezone.length) obj.timezone = this.timezone;
    if (this.scale === this.scale) obj.scale = this.scale;
    if (this.bitWidth === this.bitWidth) obj.bitWidth = this.bitWidth;
    if (this.precision === this.precision)
      obj.precision = this.precision;
    if (Object.keys(this._getMetadata()).length > 0)
      obj.metadata = this._getMetadata();
    return obj;
  }

  /**
   * Link data-field with hdml-schema.
   */
  public attachHdmlSchema(schema: NamedElement): void {
    this._hdmlSchema = schema;
  }

  /**
   * @override
   */
  public serialize(): false | DataFieldType {
    return super.serialize() as false | DataFieldType;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    if (!this.getAttribute("type")) {
      console.warn("`type` attribute is required for:", this);
    }
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
    this.dispatchEvent(
      new Event("data-field-connected", { bubbles: true }),
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
      new Event("data-field-changed", { bubbles: false }),
    );
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
    if (this._hdmlSchema) {
      this._hdmlSchema.dispatchEvent(
        new Event("data-field-disconnected", { bubbles: false }),
      );
      this._hdmlSchema = null;
    }
  }

  /**
   * Component template.
   */
  public render(): lit.TemplateResult<1> {
    return lit.html`<slot></slot>`;
  }
}

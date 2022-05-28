/**
 * @fileoverview `DataField` class definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { NamedElement } from "@hdml/element";
import { DataFieldSchema } from "../schemas/DataField.schema";

export type DataFieldType = {
  uid: string;
  name: string;
  type: string;
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
  constructor() {
    super(DataFieldSchema);
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
    return obj;
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
    this.dispatchEvent(
      new Event("data-field-connected", { bubbles: true }),
    );
  }
}

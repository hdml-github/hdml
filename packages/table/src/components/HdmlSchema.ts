/**
 * @fileoverview `HdmlSchema` class definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { debounce } from "debounce";
import { NamedElement } from "@hdml/element";
import { HdmlSchemaSchema } from "../schemas/HdmlSchema.schema";
import { DatafieldConnected } from "../events";
import { DataFieldType } from "./DataField";

export type HdmlSchemaType = {
  uid: string;
  name: string;
  fields: { [name: string]: DataFieldType };
  index?: string;
};

export class HdmlSchema extends NamedElement {
  /**
   * Reactive attributes.
   */
  public static properties = {
    ...NamedElement.properties,
  };

  private _fields: { [name: string]: DataFieldType } = {};
  private _index = "";

  /**
   * Schema fields array getter.
   */
  public get fields(): { [name: string]: DataFieldType } {
    return this._fields;
  }

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
  constructor() {
    super(HdmlSchemaSchema);
  }

  /**
   * DataField connected event listener.
   */
  private _datafieldConnectedListener(event: DatafieldConnected) {
    event.stopPropagation();
    const data = event.target.serialize();
    if (data) {
      this.fields[data.name] = data;
    }
  }

  /**
   * @override
   */
  protected serializeInternal(): HdmlSchemaType {
    const obj: HdmlSchemaType = {
      uid: this.uid,
      name: this.name,
      fields: this.fields,
    };
    if (this.index.length) obj.index = this.index;
    return obj;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener(
      "data-field-connected",
      this._datafieldConnectedListener,
    );
  }
}

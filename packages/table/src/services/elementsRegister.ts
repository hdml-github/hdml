/**
 * @fileoverview Elements register service declaration.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { MetaData } from "../components/MetaData";
import { DataField } from "../components/DataField";
import { HdmlSchema } from "../components/HdmlSchema";

let MetaDataDefined = false;
let MetaDataTag = "meta-data";

let DataFieldDefined = false;
let DataFieldTag = "data-field";

let HdmlSchemaDefined = false;
let HdmlSchemaTag = "hdml-schema";

/**
 * Define MetaData component tag name and register custom element.
 */
export async function defineMetaData(
  name?: string,
  MetaDataConstructor?: new () => MetaData,
): Promise<void> {
  if (!MetaDataDefined) {
    MetaDataDefined = true;
    if (name) {
      MetaDataTag = name;
    }
    customElements.define(
      MetaDataTag,
      MetaDataConstructor || MetaData,
    );
    await customElements.whenDefined(MetaDataTag);
  }
}

/**
 * Define DataField component tag name and register custom element.
 */
export async function defineDataField(
  name?: string,
  DataFieldConstructor?: new () => DataField,
): Promise<void> {
  if (!DataFieldDefined) {
    DataFieldDefined = true;
    if (name) {
      DataFieldTag = name;
    }
    customElements.define(
      DataFieldTag,
      DataFieldConstructor || DataField,
    );
    await customElements.whenDefined(DataFieldTag);
  }
}

/**
 * Define HdmlSchema component tag name and register custom element.
 */
export async function defineHdmlSchema(
  name?: string,
  HdmlSchemaConstructor?: new () => HdmlSchema,
): Promise<void> {
  if (!HdmlSchemaDefined) {
    HdmlSchemaDefined = true;
    if (name) {
      HdmlSchemaTag = name;
    }
    customElements.define(
      HdmlSchemaTag,
      HdmlSchemaConstructor || HdmlSchema,
    );
    await customElements.whenDefined(HdmlSchemaTag);
  }
}

/**
 * Define HdmlSchema, DataField and MetaData components tags with
 * defaults and register custom elements.
 */
export async function defineDefaults(): Promise<void> {
  await Promise.all([
    defineHdmlSchema(),
    defineDataField(),
    defineMetaData(),
  ]);
}

/**
 * Returns registered MetaData tag name.
 */
export function getMetaDataTagName(): string {
  return MetaDataTag;
}

/**
 * Returns registered DataField tag name.
 */
export function getDataFieldTagName(): string {
  return DataFieldTag;
}

/**
 * Returns registered HdmlSchema tag name.
 */
export function getHdmlSchemaTagName(): string {
  return HdmlSchemaTag;
}

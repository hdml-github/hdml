/**
 * @fileoverview `UnifiedElement` class definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { LitElement } from "lit";
import Ajv2020, { Schema } from "ajv/dist/2020";
import { getUid } from "../helpers";

const avg = new Ajv2020();

/**
 * Unified elements default `json-schema`.
 */
export const UnifiedElementSchema = {
  title: "Unified Element Schema",
  description: "Default unified element schema.",
  type: "object",
  required: ["uid"],
  properties: {
    uid: {
      title: "uid",
      description: "Element unique identifier.",
      type: "string",
      pattern:
        "^([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]" +
        "{3}-[0-9a-f]{12})|[0-9]+$",
    },
  },
};

/**
 * Unified elements `json-schema` type.
 */
export type ElementSchema = Schema & {
  required: string[];
  properties: {
    [name: string]: {
      title: string;
      description: string;
      type: string;
      pattern?: string;
      enum?: string[];
    };
  };
};

/**
 * Base class for the `hdml` elements. Responds for the uniqueness by
 * providing unique identifier `UnifiedElement#uid`.
 */
export class UnifiedElement extends LitElement {
  private _uid = getUid();
  private _schema: null | ElementSchema = null;

  /**
   * Element unique identifier getter.
   */
  public get uid(): string {
    return this._uid;
  }

  /**
   * Element `json-schema` getter.
   */
  public get schema(): null | ElementSchema {
    return this._schema;
  }

  /**
   * Class constructor.
   */
  constructor(schema?: ElementSchema) {
    super();
    if (schema) {
      if (this.assertSchemaInternal(schema)) {
        this._schema = schema;
      }
    } else {
      this._schema = UnifiedElementSchema;
    }
  }

  /**
   * Asserts appropriate piece of the element's schema. Classes that
   * extend `UnifiedElement` should override this method to add
   * assertion of the child element's schema.
   *
   * @example
   * ```typescript
   * import { UnifiedElement } from "./UnifiedElement";
   *
   * class MyClass extends UnifiedElement {
   *   protected assertInternal(schema: ElementSchema): boolean {
   *     // current cluss schema assertions
   *     return super.assertInternal(schema);
   *   }
   * }
   */
  protected assertSchemaInternal(schema: ElementSchema): boolean {
    if (!schema.properties) {
      console.error("invalid schema, `properties` is missed");
      return false;
    }
    if (!schema.required) {
      console.error("invalid schema, `required` is missed");
      return false;
    }
    if (!schema.properties.uid) {
      console.error(
        "invalid schema, `uid` property definition is missed",
      );
      return false;
    }
    if (!~schema.required.indexOf("uid")) {
      console.error(
        "invalid schema, `uid` property should be required",
      );
      return false;
    }
    return true;
  }

  /**
   * Asserts specified data using element's schema. If schema is equal
   * to null returns false.
   */
  protected assertDataInternal(data: unknown): boolean {
    if (!this.schema) {
      return false;
    } else if (!avg.validate(this.schema, data)) {
      console.error(
        `Assertion for the ${
          this.tagName
        } component failed. Provided data:\n${JSON.stringify(
          data,
          undefined,
          2,
          // eslint-disable-next-line prettier/prettier
        )}\ndoesn't match to the schema:\n${
          JSON.stringify(this.schema, undefined, 2)}`,
      );
      return false;
    }
    return true;
  }
}

/**
 * @fileoverview `SerializableElement` class definition,
 * `ElementSchema` type definition, `serializableElementSchema`
 * definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import Ajv2020, { Schema } from "ajv/dist/2020";
import { UnifiedElement } from "./UnifiedElement";

const avg = new Ajv2020();

/**
 * Serializable `hdml` element default `json-schema`.
 */
export const serializableElementSchema = {
  $id: "SERIALIZABLE",
  title: "Serializable Element",
  description: "Default serializable element schema.",
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
 * Serializable element `json-schema` type.
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
 * `SerializableElement` class provides basic interface for the
 * serialization and assertion of the `hdml` element.
 */
export class SerializableElement extends UnifiedElement {
  private _schema: ElementSchema;

  /**
   * Element `json-schema` getter.
   */
  public get schema(): ElementSchema {
    return this._schema;
  }

  /**
   * Class constructor.
   */
  constructor(schema?: ElementSchema) {
    super();
    this._schema = schema || serializableElementSchema;
  }

  /**
   * Asserts appropriate piece of the element's schema and  serialized
   * value of the element. Classes that extend `SerializableElement`
   * should override this method to add assertion of the child element
   * schema. Must only be called from the `serialize` method.
   *
   * @example
   * ```typescript
   * import { SerializableElement } from "./SerializableElement";
   *
   * class MyClass extends SerializableElement {
   *   protected assertInternal(data: unknown): unknown {
   *     // current cluss schema assertions
   *     return super.assertInternal(data);
   *   }
   * }
   *
   * @throws
   */
  protected assertInternal(data: unknown): unknown {
    let err = false;
    if (!this.schema.properties.uid) {
      console.error(
        "invalid schema, `uid` property definition is missed",
      );
      err = true;
    }
    if (!~this.schema.required.indexOf("uid")) {
      console.error(
        "invalid schema, `uid` property should be required",
      );
      err = true;
    }
    if (!avg.validate(this.schema, data)) {
      console.error(
        `Assertion for the ${
          this.tagName
        } component failed. Serialized value:\n${JSON.stringify(
          data,
          undefined,
          2,
          // eslint-disable-next-line prettier/prettier
        )}\ndoesn't match to the conponent's schema:\n${
          JSON.stringify(this.schema, undefined, 2)}`,
      );
      err = true;
    }
    return err ? false : data;
  }

  /**
   * Returns element's serialized representation. This method should
   * be overriden by the child classes to return specific for the
   * child objects.
   */
  protected serializeInternal(): unknown {
    return { uid: this.uid };
  }

  /**
   * Returns element's serialized representation based on the
   * element's attributes and properties. Throws an Error if
   * serialized object doesn't match to the element's schema.
   */
  public serialize(): unknown {
    return this.assertInternal(this.serializeInternal());
  }
}

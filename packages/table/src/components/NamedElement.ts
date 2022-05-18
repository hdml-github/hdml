/**
 * @fileoverview NamedElement class definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  SerializableElement,
  ElementSchema,
} from "./SerializableElement";

const _schema = {
  $id: "INT-8",
  title: "INT-8",
  description: "HDML table INT-8 field component.",
  type: "object",
  required: ["uid", "name"],
  properties: {
    uid: {
      title: "uid",
      description: "HDML table field unique identifier.",
      type: "string",
      pattern:
        "^([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]" +
        "{3}-[0-9a-f]{12})|[0-9]+$",
    },
    name: {
      title: "name",
      description: "Field name.",
      type: "string",
      pattern: "^[\\w\\-.]{1,64}",
    },
  },
};

/**
 * NamedElement class provides a logic to deal with the name attribute
 * and ptoperty.
 */
export class NamedElement extends SerializableElement {
  /**
   * Class constructor.
   */
  constructor(schema?: ElementSchema) {
    super(schema || _schema);
  }

  /**
   * @override
   */
  protected assertInternal(data: unknown): unknown {
    if (!this.schema.properties.name) {
      throw new Error(
        "invalid schema, `name` property definition is missed",
      );
    }
    if (!~this.schema.required.indexOf("uid")) {
      throw new Error(
        "invalid schema, `name` property should be required",
      );
    }
    return super.assertInternal(data);
  }
}

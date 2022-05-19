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
  $id: "NAMED",
  title: "Named Element",
  description: "Default named element schema.",
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
   * NamedElement reactive attributes.
   */
  public static properties = {
    /**
     * Element name.
     */
    name: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: false,
      state: false,
    },
  };

  private _name: null | string = null;

  /**
   * Element name setter.
   */
  public set name(val: null | string) {
    const old = this._name;
    this._name = val;
    this.requestUpdate("name", old);
  }

  /**
   * Element name getter.
   */
  public get name(): null | string {
    return this._name;
  }

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
    let err = false;
    if (!this.schema.properties.name) {
      console.error(
        `invalid schema, "name" property definition is missed`,
      );
      err = true;
    }
    if (!~this.schema.required.indexOf("uid")) {
      console.error(
        `invalid schema, "name" property should be required`,
      );
      err = true;
    }
    return err ? false : super.assertInternal(data);
  }
}

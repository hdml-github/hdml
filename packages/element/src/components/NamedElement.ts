/**
 * @fileoverview `NamedElement` class definition, `namedElementSchema`
 * definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  SerializableElement,
  ElementSchema,
  serializableElementSchema,
} from "./SerializableElement";

import { NameChanged } from "../events";

/**
 * Named `hdml` element default `json-schema`.
 */
export const namedElementSchema = {
  ...serializableElementSchema,
  title: "Named Element",
  description: "Default named element schema.",
  type: "object",
  required: [...serializableElementSchema.required, "name"],
  properties: {
    ...serializableElementSchema.properties,
    name: {
      title: "name",
      description: "Field name.",
      type: "string",
      pattern: "^[\\w\\-.]{1,64}",
    },
  },
};

/**
 * `NamedElement` class provides a logic to deal with the `name`
 * attribute and ptoperty.
 */
export class NamedElement extends SerializableElement {
  /**
   * `NamedElement` reactive attributes.
   */
  public static properties = {
    /**
     * `hdml` element `name` attribtue.
     */
    name: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },
  };

  /**
   * Observed attributes list.
   */
  public static observedAttributes = ["name"];

  /**
   * Private field to store `name` property value.
   */
  private _name = "";

  /**
   * `hdml` element `name` setter.
   */
  public set name(val: string) {
    const old = this._name;
    this._name = val;
    this.requestUpdate("name", old);
  }

  /**
   * `hdml` element `name` getter.
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Class constructor.
   */
  constructor(schema?: ElementSchema) {
    super(schema || namedElementSchema);
  }

  /**
   * @override
   */
  protected assertInternal(data: unknown): unknown {
    let err = false;
    if (!this.schema.properties.name) {
      console.error(
        "invalid schema, `name` property definition is missed",
      );
      err = true;
    }
    if (!~this.schema.required.indexOf("name")) {
      console.error(
        "invalid schema, `name` property should be required",
      );
      err = true;
    }
    return err ? false : super.assertInternal(data);
  }

  /**
   * @override
   */
  protected serializeInternal(): unknown {
    return { uid: this.uid, name: this.name };
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    if (!this.getAttribute("name")) {
      console.warn("`name` attribute is required for:", this);
    }
  }

  /**
   * @override
   */
  public attributeChangedCallback(
    name: string,
    old: string,
    val: string,
  ): void {
    super.attributeChangedCallback(name, old, val);
    if (name === "name") {
      this.dispatchEvent(
        new CustomEvent<NameChanged>("name-changed", {
          bubbles: true,
          cancelable: true,
          composed: false,
          detail: { val, old },
        }),
      );
    }
  }
}

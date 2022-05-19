/**
 * @fileoverview HdmlElement class definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { LitElement } from "lit";
import Ajv2020, { Schema } from "ajv/dist/2020";
import { getUid } from "../services";

const avg = new Ajv2020();

/**
 * Base class for HDML elements. Responds for the uniqueness by
 * providing unique identifier (BaseElement#uid) for the component.
 */
export default class HdmlElement extends LitElement {
  private _uid = getUid();
  private _schema: Schema;

  /**
   * Element unique identifier getter.
   */
  public get uid(): string {
    return this._uid;
  }

  /**
   * Class constructor.
   */
  constructor(schema: Schema) {
    super();
    this._schema = schema;
  }

  /**
   * Serialize element.
   */
  public serialize(): { uid: string } {
    return {
      uid: this.uid,
    };
  }

  /**
   * Assert serialized element data.
   */
  public assert(): boolean {
    if (avg.validate(this._schema, this.serialize())) {
      return true;
    } else {
      console.error(
        `invalid ${
          this.tagName
        } component definition: ${JSON.stringify(this.serialize())}`,
      );
      return false;
    }
  }
}

/**
 * @fileoverview The `FieldElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { FieldData, DataType } from "@hdml/schema";
import {
  FIELD_NAME_REGEXP,
  TABLE_ORIGIN_REGEXP,
  FIELD_TYPE_REGEXP,
  FIELD_DATE_UNIT_REGEXP,
  FIELD_TIME_UNIT_REGEXP,
  FIELD_BIT_WIDTH_REGEXP,
  FIELD_TZ_REGEXP,
  FIELD_AGG_REGEXP,
} from "../helpers/constants";
import { getTableTag } from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";

/**
 * An `hdml-field` element event detail interface.
 */
export interface FieldEventDetail {
  field: FieldElement;
}

/**
 * The `FieldElement` class.
 */
export class FieldElement extends UnifiedElement {
  /**
   * Reactive attributes.
   */
  public static properties = {
    /**
     * A `name` property definition.
     */
    name: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `origin` property definition.
     */
    origin: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `clause` property definition.
     */
    clause: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `type` property definition.
     */
    type: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `nullable` property definition.
     */
    nullable: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `scale` property definition.
     */
    scale: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `precision` property definition.
     */
    precision: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `bitWidth` property definition.
     */
    bitWidth: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `unit` property definition.
     */
    unit: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `timezone` property definition.
     */
    timezone: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `agg` property definition.
     */
    agg: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `asc` property definition.
     */
    asc: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },
  };

  /**
   * A `name` private property.
   */
  private _name: null | string = null;

  /**
   * A `origin` private property.
   */
  private _origin: null | string = null;

  /**
   * A `clause` private property.
   */
  private _clause: null | string = null;

  /**
   * A `type` private property.
   */
  private _type: null | string = null;

  /**
   * A `nullable` private property.
   */
  private _nullable: null | string = null;

  /**
   * A `scale` private property.
   */
  private _scale: null | string = null;

  /**
   * A `precision` private property.
   */
  private _precision: null | string = null;

  /**
   * A `bitWidth` private property.
   */
  private _bitWidth: null | string = null;

  /**
   * A `unit` private property.
   */
  private _unit: null | string = null;

  /**
   * A `timezone` private property.
   */
  private _timezone: null | string = null;

  /**
   * A `agg` private property.
   */
  private _agg: null | string = null;

  /**
   * A `asc` private property.
   */
  private _asc: null | string = null;

  /**
   * A `name` setter.
   */
  public set name(val: null | string) {
    if (val === null || val === "" || FIELD_NAME_REGEXP.test(val)) {
      const old = this._name;
      this._name = val;
      this.requestUpdate("name", old);
    } else {
      console.error(
        `The \`name\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("name") === val) {
        if (this._name === null) {
          this.removeAttribute("name");
        } else {
          this.setAttribute("name", this._name);
        }
      }
    }
  }

  /**
   * A `name` getter.
   */
  public get name(): null | string {
    return this._name;
  }

  /**
   * A `origin` setter.
   */
  public set origin(val: null | string) {
    if (val === null || val === "" || TABLE_ORIGIN_REGEXP.test(val)) {
      const old = this._origin;
      this._origin = val;
      this.requestUpdate("origin", old);
    } else {
      console.error(
        `The \`origin\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("origin") === val) {
        if (this._origin === null) {
          this.removeAttribute("origin");
        } else {
          this.setAttribute("origin", this._origin);
        }
      }
    }
  }

  /**
   * A `origin` getter.
   */
  public get origin(): null | string {
    return this._origin;
  }
}

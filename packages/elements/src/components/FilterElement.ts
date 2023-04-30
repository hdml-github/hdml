/**
 * @fileoverview The `FilterElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { FilterType, FilterName } from "@hdml/schema";

import "../events";
import {
  FIELD_NAME_REGEXP,
  FILTER_TYPE_REGEXP,
  FILTER_CLAUSE_REGEXP,
  FILTER_NAME_REGEXP,
} from "../helpers/constants";
import { getConnectiveTag } from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";

/**
 * An `hdml-filter` element event detail interface.
 */
export interface FilterEventDetail {
  filter: FilterElement;
}

/**
 * The `FilterElement` class.
 */
export class FilterElement extends UnifiedElement {
  /**
   * Reactive attributes.
   */
  public static properties = {
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
     * A `left` property definition.
     */
    left: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `right` property definition.
     */
    right: {
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
  };

  /**
   * A `type` private property.
   */
  private _type: null | string = null;

  /**
   * A `left` private property.
   */
  private _left: null | string = null;

  /**
   * A `right` private property.
   */
  private _right: null | string = null;

  /**
   * A `clause` private property.
   */
  private _clause: null | string = null;

  /**
   * A `type` setter.
   */
  public set type(val: null | string) {
    if (val === null || val === "" || FILTER_TYPE_REGEXP.test(val)) {
      const old = this._type;
      this._type = val;
      this.requestUpdate("type", old);
    } else {
      console.error(
        `The \`type\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("type") === val) {
        if (this._type === null) {
          this.removeAttribute("type");
        } else {
          this.setAttribute("type", this._type);
        }
      }
    }
  }

  /**
   * A `type` getter.
   */
  public get type(): null | string {
    return this._type;
  }

  /**
   * A `left` setter.
   */
  public set left(val: null | string) {
    if (val === null || val === "" || FIELD_NAME_REGEXP.test(val)) {
      const old = this._left;
      this._left = val;
      this.requestUpdate("left", old);
    } else {
      console.error(
        `The \`left\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("left") === val) {
        if (this._left === null) {
          this.removeAttribute("left");
        } else {
          this.setAttribute("left", this._left);
        }
      }
    }
  }

  /**
   * A `left` getter.
   */
  public get left(): null | string {
    return this._left;
  }

  /**
   * A `right` setter.
   */
  public set right(val: null | string) {
    if (val === null || val === "" || FIELD_NAME_REGEXP.test(val)) {
      const old = this._right;
      this._right = val;
      this.requestUpdate("right", old);
    } else {
      console.error(
        `The \`right\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("right") === val) {
        if (this._right === null) {
          this.removeAttribute("right");
        } else {
          this.setAttribute("right", this._right);
        }
      }
    }
  }

  /**
   * A `right` getter.
   */
  public get right(): null | string {
    return this._right;
  }

  /**
   * A `clause` setter.
   */
  public set clause(val: null | string) {
    if (
      val === null ||
      val === "" ||
      FILTER_CLAUSE_REGEXP.test(val)
    ) {
      const old = this._clause;
      this._clause = val;
      this.requestUpdate("clause", old);
    } else {
      console.error(
        `The \`clause\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("clause") === val) {
        if (this._clause === null) {
          this.removeAttribute("clause");
        } else {
          this.setAttribute("clause", this._clause);
        }
      }
    }
  }

  /**
   * A `clause` getter.
   */
  public get clause(): null | string {
    return this._clause;
  }
}

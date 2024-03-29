/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { FilterType, FilterName, FilterDef } from "@hdml/schema";
import {
  FIELD_NAME_REGEXP,
  FILTER_TYPE_REGEXP,
  FILTER_CLAUSE_REGEXP,
  FILTER_NAME_REGEXP,
} from "../helpers/constants";
import { getConnectiveTag } from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";

/**
 * `hdml-filter:connected`, `hdml-filter:changed`,
 * `hdml-filter:request`, `hdml-filter:disconnected` events details
 * interface.
 */
export interface FilterDetail {
  filter: FilterElement;
}

/**
 * `FilterElement` class. Adds an `HTML` tag (default `hdml-filter`)
 * that allows the user to describe a filter to be applied to the data
 * frame.
 */
export class FilterElement extends UnifiedElement {
  /**
   * Reactive attributes.
   */
  public static properties = {
    /**
     * The `type` property definition.
     */
    type: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * The `left` property definition.
     */
    left: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * The `right` property definition.
     */
    right: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * The `clause` property definition.
     */
    clause: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * The `name` property definition.
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
   * The `type` private property.
   */
  private _type: null | string = null;

  /**
   * The `left` private property.
   */
  private _left: null | string = null;

  /**
   * The `right` private property.
   */
  private _right: null | string = null;

  /**
   * The `clause` private property.
   */
  private _clause: null | string = null;

  /**
   * The `name` private property.
   */
  private _name: null | string = null;

  /**
   * The assosiated `ConnectiveElement` element.
   */
  private _connective: null | Element = null;

  /**
   * The `type` setter.
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
   * The `type` getter.
   */
  public get type(): null | string {
    return this._type;
  }

  /**
   * The `left` setter.
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
   * The `left` getter.
   */
  public get left(): null | string {
    return this._left;
  }

  /**
   * The `right` setter.
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
   * The `right` getter.
   */
  public get right(): null | string {
    return this._right;
  }

  /**
   * The `clause` setter.
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
   * The `clause` getter.
   */
  public get clause(): null | string {
    return this._clause ? this._clause.replaceAll("`", '"') : null;
  }

  /**
   * The `name` setter.
   */
  public set name(val: null | string) {
    if (val === null || val === "" || FILTER_NAME_REGEXP.test(val)) {
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
   * The `name` getter.
   */
  public get name(): null | string {
    return this._name;
  }

  /**
   * The `FilterDef` object.
   */
  public get data(): FilterDef {
    if (!this.type) {
      throw new Error("A `type` property is required.");
    }
    let filter: FilterDef;
    switch (this.type) {
      case "expr":
        if (!this.clause) {
          throw new Error();
        }
        filter = {
          type: FilterType.Expr,
          options: {
            clause: this.clause,
          },
        };
        break;
      case "keys":
        if (!this.left || !this.right) {
          throw new Error();
        }
        filter = {
          type: FilterType.Keys,
          options: {
            left: this.left,
            right: this.right,
          },
        };
        break;
      case "named":
        if (!this.name) {
          throw new Error();
        }
        filter = {
          type: FilterType.Named,
          options: {
            name: this._getName(this.name),
            field: "",
            values: [],
          },
        };
        break;
      default:
        throw new Error("Unsupported `type` attribute value.");
    }
    return filter;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    this._connective = this._getConnective();
    if (this._connective) {
      this._connective.dispatchEvent(
        new CustomEvent<FilterDetail>("hdml-filter:connected", {
          cancelable: false,
          composed: false,
          bubbles: false,
          detail: {
            filter: this,
          },
        }),
      );
    }
  }

  /**
   * @override
   */
  public attributeChangedCallback(
    name: string,
    old: string,
    value: string,
  ): void {
    super.attributeChangedCallback(name, old, value);
    this._dispatchChangedEvent();
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    if (this._connective) {
      this._connective.dispatchEvent(
        new CustomEvent<FilterDetail>("hdml-filter:disconnected", {
          cancelable: false,
          composed: false,
          bubbles: false,
          detail: {
            filter: this,
          },
        }),
      );
      this._connective = null;
    }
    super.disconnectedCallback();
  }

  /**
   * Component renderer.
   */
  public render(): TemplateResult<1> {
    return html`<!-- FilterElement -->`;
  }

  /**
   * Returns the associated `ConnectiveElement` element if it exists,
   * or `null` otherwise.
   */
  private _getConnective(): null | Element {
    let element = this.parentElement;
    while (
      element &&
      element.tagName !== "BODY" &&
      element.tagName !== getConnectiveTag().toUpperCase()
    ) {
      element = element.parentElement;
    }
    return element && element.tagName !== "BODY" ? element : null;
  }

  /**
   * Dispatches the `hdml-filter:changed` event.
   */
  private _dispatchChangedEvent(): void {
    this.dispatchEvent(
      new CustomEvent<FilterDetail>("hdml-filter:changed", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          filter: this,
        },
      }),
    );
  }

  /**
   * Converts a `name` property to a `FilterName` enum.
   */
  private _getName(name: string): FilterName {
    switch (name) {
      case "equals":
        return FilterName.Equals;
      case "not-equals":
        return FilterName.NotEquals;
      case "contains":
        return FilterName.Contains;
      case "not-contains":
        return FilterName.NotContains;
      case "starts-with":
        return FilterName.StartsWith;
      case "ends-with":
        return FilterName.EndsWith;
      case "greater":
        return FilterName.Greater;
      case "greater-equal":
        return FilterName.GreaterEqual;
      case "less":
        return FilterName.Less;
      case "less-equal":
        return FilterName.LessEqual;
      case "is-null":
        return FilterName.IsNull;
      case "is-not-null":
        return FilterName.IsNotNull;
      case "between":
        return FilterName.Between;
      default:
        throw new Error("Unsupported `name` attribute value.");
    }
  }
}

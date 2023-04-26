/**
 * @fileoverview The `ModelElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { UnifiedElement } from "./UnifiedElement";
import { MODEL_NAME_REGEXP } from "../helpers/constants";

/**
 * Model identifier custom events scope interface.
 */
export interface IModelTarget {
  hdmlTarget: ModelElement;
}

/**
 * `ModelElement` class.
 */
export class ModelElement extends UnifiedElement {
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
  };

  /**
   * A `name` private property.
   */
  private _name: null | string = null;

  /**
   * A `name` setter.
   */
  public set name(val: null | string) {
    if (val === null || val === "" || MODEL_NAME_REGEXP.test(val)) {
      const old = this._name;
      this._name = val;
      this.requestUpdate("name", old);
    } else {
      console.error(
        `The \`name\` property value "${val}" doesn't match an ` +
          "element schema. Skipped.",
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
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    document.body.dispatchEvent(
      new CustomEvent<IModelTarget>("hdml-model-connected", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          hdmlTarget: this,
        },
      }),
    );
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
    this.dispatchEvent(
      new CustomEvent<IModelTarget>("hdml-model-changed", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          hdmlTarget: this,
        },
      }),
    );
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    super.disconnectedCallback();
    document.body.dispatchEvent(
      new CustomEvent<IModelTarget>("hdml-model-disconnected", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          hdmlTarget: this,
        },
      }),
    );
  }

  /**
   * Component template.
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }
}

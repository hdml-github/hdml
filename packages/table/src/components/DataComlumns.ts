/**
 * @fileoverview DataColumns class definition and <data-columns>
 * custom element registration.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult, LitElement } from "lit";
import { Warnings } from "@hdml/messages";

/**
 * Returns parent <hdml-table/> component or null if there are no
 * parent <hdml-table/> in the DOM-tree for the specified element.
 */
export function getParentTable(element: Element): null | Element {
  if (element.parentElement) {
    if (element.parentElement.tagName === "HDML-TABLE") {
      return element.parentElement;
    } else {
      return getParentTable(element.parentElement);
    }
  } else {
    return null;
  }
}

/**
 * HDML <data-columns/> component class. This element responds for
 * grouping table's fields components. It should only be rendered
 * inside the <hdml-table /> component and only one <data-columns />
 * component can be rendered in <hdml-table />. Any exception from
 * these rules cause the console warning.
 */
export default class DataColumns extends LitElement {
  public static properties = {
    /**
     * Disabled columns flag.
     */
    disabled: {
      type: Boolean,
      attribute: true,
      reflect: true,
      noAccessor: false,
      state: false,
      fromAttribute: (value: string): boolean => {
        return typeof value === "string" && value.length === 0
          ? true
          : false;
      },
      toAttribute: (value: boolean): null | string => {
        return value ? "true" : null;
      },
    },
  };

  private _disabled = false;

  public set disabled(value: boolean) {
    const old = this._disabled;
    this._disabled = value;
    this.requestUpdate("disabled", old);
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  /**
   * Associated <hdml-table/> element.
   */
  public get table(): null | Element {
    return getParentTable(this);
  }

  /**
   * Class constructor.
   */
  constructor() {
    super();
  }

  /**
   * Checks DOM-structure correctness. Disables component if there are
   * some errors in surrounding structure.
   */
  public assertDomStructure(): void {
    if (!this.table && !this._disabled) {
      console.warn(Warning.NO_ASSOCIATED_TABLE);
      this.disabled = true;
      return;
    }
    if (this.table && this._disabled) {
      console.warn(Warning.CANT_DISABLE_COLUMS);
      this.disabled = false;
      return;
    }
    // if (
    //   this.table &&
    //   this.table.querySelectorAll("data-columns").length > 1
    // ) {
    //   this.disabled = true;
    // }
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    this.assertDomStructure();
  }

  /**
   * @override
   */
  public attributeChangedCallback(
    name: string,
    oldVal: string,
    newVal: string,
  ): void {
    super.attributeChangedCallback(name, oldVal, newVal);
    this.assertDomStructure();
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  /**
   * Component renderer.
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }
}
customElements.define("data-columns", DataColumns);

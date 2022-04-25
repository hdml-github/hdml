/**
 * @fileoverview DataColumns class definition and <data-columns>
 * custom element registration.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult, LitElement } from "lit";

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
   * Associated <html-table/> component.
   */
  private _table: null | Element = null;

  /**
   * Class constructor.
   */
  constructor() {
    super();
  }

  /**
   * Returns parent <hdml-table/> component or null if there are no
   * parent <hdml-table/> in the DOM-tree.
   */
  public getParentTable(element?: Element): null | Element {
    element = element || this;
    if (element.parentElement) {
      if (element.parentElement.tagName === "HDML-TABLE") {
        return element.parentElement;
      } else {
        return this.getParentTable(element.parentElement);
      }
    } else {
      return null;
    }
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    this._table = this.getParentTable();
    if (this._table === null) {
      console.warn(
        "No associated <hdml-table/> component found in the " +
          "DOM-tree.",
      );
      this.disabled = true;
    }
    if (
      this._table &&
      this._table.querySelectorAll("data-columns").length > 1
    ) {
      this.setAttribute("disabled", "");
    }
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
    // if (name === "disabled") {
    //   if (this._table === null) {
    //     console.warn(
    //       "No associated <hdml-table/> component found in the " +
    //         "DOM-tree.",
    //     );
    //     this.disabled = true;
    //   }
    // }
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

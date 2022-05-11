/**
 * @fileoverview Int8 class definition and <int-8/> registration.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import HdmlElement from "../../HdmlElement";

/**
 *
 */
export default class Int8 extends HdmlElement {
  /**
   * HDML table reactive properties.
   */
  public static properties = {
    /**
     * Table name.
     */
    name: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: false,
      state: false,
    },
  };

  /**
   * Table name storage.
   */
  private _name?: string;

  /**
   * Table name setter.
   */
  public set name(val: string) {
    if (typeof val !== "string") {
      throw new TypeError();
    }
    const old = this._name;
    this._name = val;
    this.requestUpdate("name", old);
  }

  /**
   * Table name getter.
   */
  public get name(): string {
    return this._name || "";
  }

  /**
   * Class constructor.
   */
  constructor() {
    super();
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
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
    return html`<!-- Int8 -->`;
  }
}
customElements.define("int-8", Int8);

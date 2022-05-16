/**
 * @fileoverview Int8 class definition and <int-8/> registration.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import HdmlElement from "../../HdmlElement";
import Int8Schema from "./Int8.schema";

/**
 *
 */
export default class Int8 extends HdmlElement {
  /**
   * HDML Int8 field reactive properties.
   */
  public static properties = {
    /**
     * Field name.
     */
    name: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: false,
      state: false,
    },

    /**
     * Field nullable flag.
     */
    nullable: {
      type: Boolean,
      attribute: true,
      reflect: true,
      noAccessor: false,
      state: false,
    },
  };

  /**
   * Field name storage.
   */
  private _name?: string;

  /**
   * Field name setter.
   */
  public set name(val: string) {
    if (typeof val !== "string") {
      throw new TypeError(
        `"name" attribute should be a string, ${typeof val} received`,
      );
    }
    const old = this._name;
    this._name = val;
    this.requestUpdate("name", old);
  }

  /**
   * Field name getter.
   */
  public get name(): string {
    return this._name || "";
  }

  private _nullable = false;

  /**
   * Field nullable flag setter.
   */
  public set nullable(val: boolean) {
    if (typeof val !== "boolean") {
      throw new TypeError(
        '"nullable" attribute should be a boolean, ' +
          typeof val +
          " received",
      );
    }
    const old = this._nullable;
    this._nullable = val;
    this.requestUpdate("nullable", old);
  }

  /**
   * Field nullable flag getter.
   */
  public get nullable(): boolean {
    return this._nullable;
  }

  /**
   * Class constructor.
   */
  constructor() {
    super(Int8Schema);
  }

  /**
   * Element serializer.
   */
  public serialize(): {
    uid: string;
    name: string;
    nullable: boolean;
  } {
    return {
      uid: this.uid,
      name: this.name,
      nullable: this.nullable,
    };
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
    return html`<slot></slot>`;
  }
}
customElements.define("int-8", Int8);

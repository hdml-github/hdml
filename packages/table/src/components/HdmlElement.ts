/**
 * @fileoverview HdmlElement class definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult, LitElement } from "lit";
import getUid from "../helpers/getUid";

/**
 * Base class for HDML elements. Responds for the uniqueness by
 * providing unique identifier (BaseElement#uid) for the component.
 */
export default class HdmlElement extends LitElement {
  private _uid = getUid();

  /**
   * Element unique identifier getter.
   */
  public get uid(): string {
    return this._uid;
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

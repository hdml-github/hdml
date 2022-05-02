/**
 * @fileoverview BaseElement class definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult, LitElement } from "lit";
import getUid from "../helpers/getUid";
import elementsParser from "../services/elementsParser";

/**
 * Base class for HDML table's elements. Responds for the uniqueness
 * by providing unique identifier (BaseElement#uid) for the component.
 */
export default class HdmlElement extends LitElement {
  private _uid = getUid();

  public get uid(): string {
    return this._uid;
  }

  constructor() {
    super();
  }

  /**
   * @override
   */
  public async connectedCallback(): Promise<void> {
    super.connectedCallback();
    await elementsParser.addElement(this);
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    super.disconnectedCallback();
    elementsParser.removeElement(this);
  }

  /**
   * Component renderer.
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }
}

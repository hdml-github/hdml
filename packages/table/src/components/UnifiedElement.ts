/**
 * @fileoverview UnifiedElement class definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { LitElement } from "lit";
import { getUid } from "../helpers";
import { UidElements } from "../services";

/**
 * Base class for the HDML elements. Responds for the uniqueness by
 * providing unique identifier (BaseElement#uid) for the component.
 */
export class UnifiedElement extends LitElement {
  private _uid = getUid();

  /**
   * Element unique identifier getter.
   */
  public get uid(): string {
    return this._uid;
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
    UidElements.add(this);
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    UidElements.remove(this);
    super.disconnectedCallback();
  }
}

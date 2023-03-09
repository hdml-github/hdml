/**
 * @fileoverview `UnifiedElement` class definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { LitElement } from "lit";
import { getUid } from "../helpers";

/**
 * Base class for the `hdml` elements. Responds for the uniqueness by
 * providing unique identifier `UnifiedElement#uid`.
 */
export class UnifiedElement extends LitElement {
  private _uid = getUid();

  /**
   * Element unique identifier getter.
   */
  public get uid(): string {
    return this._uid;
  }
}

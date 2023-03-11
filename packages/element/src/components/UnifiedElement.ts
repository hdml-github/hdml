/**
 * @fileoverview `UnifiedElement` class definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { LitElement } from "lit";
import { signature } from "../helpers/signature";
import { getUid } from "../helpers/getUid";

/**
 * Base class for the `hdml` elements. Responds for the uniqueness by
 * providing unique identifier `UnifiedElement#uid`.
 */
export class UnifiedElement extends LitElement {
  private [signature] = getUid();

  /**
   * Element unique identifier getter.
   */
  public get uid(): string {
    return this[signature];
  }
}

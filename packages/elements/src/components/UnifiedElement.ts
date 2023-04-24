/**
 * @fileoverview `UnifiedElement` class definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { LitElement } from "lit";
import { signature } from "../helpers/constants";
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

  /**
   * Verifies a signature of a provided component. Returns `true` if
   * signature is ok, false otherwise. This allows us to avoid some
   * security issues.
   */
  public verify(component: UnifiedElement): boolean {
    return component[signature] === component.uid;
  }
}

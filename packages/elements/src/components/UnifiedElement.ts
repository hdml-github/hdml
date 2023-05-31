/**
 * @fileoverview `UnifiedElement` class definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { LitElement } from "lit";
import { signature } from "../helpers/constants";
import { getUid } from "../helpers/getUid";
import {
  getModelTag,
  getTableTag,
  getFieldTag,
  getJoinTag,
  getConnectiveTag,
  getFilterTag,
  getFrameTag,
  getFilterByTag,
  getGroupByTag,
  getSortByTag,
} from "../helpers/elementsRegister";

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

  /**
   * Returns all `UnifiedElement` elements specified by the `tag` that
   * are descendants of a current `UnifiedElement` (and are not
   * descendant of another nested `UnifiedElement` if any).
   */
  public queryHdmlChildren<T extends UnifiedElement>(
    tag: string,
  ): T[] {
    const result: T[] = [];
    if (
      tag === getModelTag() ||
      tag === getTableTag() ||
      tag === getFieldTag() ||
      tag === getJoinTag() ||
      tag === getConnectiveTag() ||
      tag === getFilterTag() ||
      tag === getFrameTag() ||
      tag === getFilterByTag() ||
      tag === getGroupByTag() ||
      tag === getSortByTag()
    ) {
      this.querySelectorAll<T>(tag).forEach((element) => {
        let parent = element.parentElement;
        let done = parent instanceof UnifiedElement;
        while (parent && !done) {
          parent = parent?.parentElement;
          done = parent instanceof UnifiedElement;
        }
        if (parent === this) {
          result.push(element);
        }
      });
    }
    return result;
  }
}

/**
 * @fileoverview Declaration of the getUid function.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { v1, v5 } from "uuid";

/**
 * Returns random session unique UUID-like string.
 *
 * @example
 * ```TypeScript
 * import getUid from "./getUid";
 *
 * console.log(getUid() === getUid());
 * // => false
 * ```
 */
export function getUid(): string {
  return v5(v1(), v1()).toString();
}

/**
 * @fileoverview Declaration of the getUid function.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { v1, v5 } from "uuid";

const ns = "00000000-0000-0000-0000-000000000000";
const stringsMap: Map<string, string> = new Map();

/**
 * Returns random session unique UUID-like string if `value` is not
 * specified. If a `string` will be provided as a `value` returns
 * calculated UUID hash of this string, persistent for the session.
 *
 * @example
 * ```TypeScript
 * import getUid from "./getUid";
 *
 * console.log(getUid() === getUid());
 * // => false
 *
 * console.log(getUid("string") === getUid("string"));
 * // => true
 * ```
 */
export function getUid(value?: string): string {
  if (typeof value === "string") {
    if (!stringsMap.has(value)) {
      stringsMap.set(value, v5(value, ns).toString());
    }
    return stringsMap.get(value) as string;
  }
  return v5(v1(), v1()).toString();
}

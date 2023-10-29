/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { type QueryBuf, type QueryDef } from "@hdml/schema";
import { getSQL } from "./sql/orchestrate";
import { getHTML } from "./html/orchestrate";

/**
 * Converts the specified `query` to an `SQL` string (default) or to
 * an `HTML` string if the `toHtml` parameter is set to `true`. Throws
 * if the `query` object does not contain a `model` property.
 */
export function orchestrate(
  query: QueryBuf | QueryDef,
  toHtml = false,
): string {
  if (!toHtml) {
    return getSQL(query);
  } else {
    return getHTML(query);
  }
}

export { getSQL, getHTML };

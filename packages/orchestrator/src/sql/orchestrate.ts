/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { type QueryBuf, type QueryDef } from "@hdml/schema";
import { getModelSQL } from "./model";
import { getFrameSQL } from "./frame";

/**
 * Converts the specified `query` to an `SQL` string. Throws if the
 * `query` object does not contain a `model` property.
 */
export function getSQL(query: QueryBuf | QueryDef): string {
  if (!query.model) {
    throw new Error("Model is missing.");
  }
  if (query.frame) {
    return getFrameSQL(query.frame, query.model, 0);
  } else {
    return getModelSQL(query.model, 0);
  }
}

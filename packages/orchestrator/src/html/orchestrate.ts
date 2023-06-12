/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { type Query, type QueryDef } from "@hdml/schema";
import { getModelHTML } from "./model";
import { getFrameHTML } from "./frame";

/**
 * Converts the specified `query` to an `HTML` string. Throws if the
 * `query` object does not contain a `model` property.
 */
export function getHTML(query: Query | QueryDef): string {
  if (!query.model) {
    throw new Error("Model is missing.");
  }
  if (query.frame) {
    return getFrameHTML(query.frame, query.model, 0, true);
  } else {
    return getModelHTML(query.model, 0, true);
  }
}

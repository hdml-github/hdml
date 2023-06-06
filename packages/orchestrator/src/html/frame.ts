/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  type ModelDef,
  type FieldDef,
  type FrameDef,
} from "@hdml/schema";
import { getModelHTML } from "./model";
import { getFieldHTML } from "./fields";
import { getFilterClauseHTML } from "./filter";
import { t } from "../const";

/**
 * Returns the HTML representation of the `frame` and the `model`.
 */
export function getFrameHTML(
  frame: FrameDef,
  model: ModelDef,
  level = 0,
  isRoot = false,
): string {
  const pre = t.repeat(level);
  let html = "";
  if (frame.parent) {
    html = html + getFrameHTML(frame.parent, model, level);
  } else {
    html = html + getModelHTML(model, level);
  }
  html =
    html +
    `${pre}<hdml-frame ` +
    `name="${frame.name}" ` +
    `source="${`?${frame.source.split("?")[1]}`}" ` +
    `offset="${frame.offset}" ` +
    `limit="${frame.limit}"` +
    `${isRoot ? ` root="root"` : ""}>\n`;
  html =
    html +
    frame.fields
      .sort((a, b) =>
        a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
      )
      .map((field: FieldDef) => `${pre}${t}${getFieldHTML(field)}`)
      .join("\n") +
    "\n";
  if (frame.filterBy) {
    html = html + `${pre}${t}<hdml-filter-by>\n`;
    html = html + getFilterClauseHTML(frame.filterBy, level + 2);
    html = html + `${pre}${t}</hdml-filter-by>\n`;
  }
  if (frame.groupBy && frame.groupBy.length > 0) {
    html = html + `${pre}${t}<hdml-group-by>\n`;
    html =
      `${html}` +
      frame.groupBy
        .map((field) => `${pre}${t}${t}${getFieldHTML(field)}`)
        .join("\n") +
      "\n";
    html = html + `${pre}${t}</hdml-group-by>\n`;
  }
  if (frame.sortBy && frame.sortBy.length > 0) {
    html = html + `${pre}${t}<hdml-sort-by>\n`;
    html =
      `${html}` +
      frame.sortBy
        .map((field) => `${pre}${t}${t}${getFieldHTML(field, true)}`)
        .join("\n") +
      "\n";
    html = html + `${pre}${t}</hdml-sort-by>\n`;
  }
  html = html + `${pre}</hdml-frame>\n`;
  return html;
}

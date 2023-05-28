import {
  type ModelData,
  type FieldData,
  FrameData,
} from "@hdml/schema";
import { getModelHTML } from "./model";
import { getFieldHTML } from "./fields";
import { getFilterClauseHTML } from "./filter";
import { t } from "../const";

export function getFrameHTML(
  frame: FrameData,
  model: ModelData,
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
    `source="${frame.source}" ` +
    `offset="${frame.offset}" ` +
    `limit="${frame.limit}"` +
    `${isRoot ? ` root="root"` : ""}>\n`;
  html =
    html +
    frame.fields
      .sort((a, b) =>
        a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
      )
      .map((field: FieldData) => `${pre}${t}${getFieldHTML(field)}`)
      .join("\n") +
    "\n";
  if (frame.filterBy) {
    html = html + getFilterClauseHTML(frame.filterBy, level + 1);
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

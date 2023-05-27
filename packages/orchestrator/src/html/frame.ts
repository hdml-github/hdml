import {
  type ModelData,
  type FieldData,
  FrameData,
} from "@hdml/schema";
import { getModelHTML } from "./model";
import { getFieldHTML } from "./fields";
import { getFilterClauseSQL } from "./filter";
import { t } from "../const";

export function getFrameHTML(
  frame: FrameData,
  model: ModelData,
  level = 0,
): string {
  const pre = t.repeat(level);
  const from = frame.parent ? frame.parent.name : model.name;
  let sql = "";
  if (frame.parent) {
    sql = sql + `${pre}with "${frame.parent.name}" as (\n`;
    sql = sql + getFrameHTML(frame.parent, model, level + 1);
    sql = sql + `${pre})\n`;
  } else {
    sql = sql + `${pre}with "${model.name}" as (\n`;
    sql = sql + getModelHTML(model, level);
    sql = sql + `${pre})\n`;
  }
  // SELECT
  sql = sql + `${pre}select\n`;
  sql =
    sql +
    frame.fields
      .sort((a, b) =>
        a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
      )
      .map((field: FieldData) => `${pre}${t}${getFieldHTML(field)}`)
      .join(",\n") +
    "\n";
  // FROM
  sql = sql + `${pre}from\n`;
  sql = sql + `${pre}${t}"${from}"\n`;
  // WHERE
  if (frame.filterBy) {
    sql = sql + `${pre}where\n`;
    sql = sql + getFilterClauseSQL(frame.filterBy, level + 1);
  }
  // GROUP BY
  if (frame.groupBy && frame.groupBy.length > 0) {
    sql = sql + `${pre}group by\n`;
    sql =
      `${sql}${pre}${t}` +
      frame.groupBy
        .map((field) => {
          for (let i = 0; i < frame.fields.length; i++) {
            if (field.name === frame.fields[i].name) {
              return `${i + 1}`;
            }
          }
          throw new Error("Invalid `groupBy` configuration.");
        })
        .join(", ");
    sql = sql + "\n";
  }
  // ORDER BY
  if (frame.sortBy && frame.sortBy.length > 0) {
    sql = sql + `${pre}order by\n`;
    sql =
      `${sql}${pre}${t}` +
      frame.sortBy
        .map((field) => {
          for (let i = 0; i < frame.fields.length; i++) {
            if (field.name === frame.fields[i].name) {
              return `${i + 1}${field.asc ? "" : " desc"}`;
            }
          }
          throw new Error("Invalid `sortBy` configuration.");
        })
        .join(", ");
    sql = sql + "\n";
  }
  // OFFSET
  sql = sql + `${pre}offset ${frame.offset.toString()}\n`;
  // LIMIT
  sql = sql + `${pre}limit ${frame.limit.toString()}\n`;
  return sql;
}

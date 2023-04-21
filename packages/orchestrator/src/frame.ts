import {
  type ModelData,
  type FieldData,
  FrameData,
} from "@hdml/schema";
import { getModelSQL } from "./model";
import { getFrameFieldSQL } from "./fields";
import { t } from "./const";

export function getFrameSQL(
  frame: FrameData,
  model: ModelData,
  level = 0,
): string {
  const pre = t.repeat(level);
  let sql = "";
  if (frame.parent) {
    sql = sql + `${pre}with "${frame.parent.name}" as (\n`;
    sql = sql + getFrameSQL(frame.parent, model, level + 1);
    sql = sql + `${pre})\n`;
  } else {
    sql = sql + `${pre}${t}with "${model.name}" as (\n`;
    sql = sql + getModelSQL(model);
    sql = sql + `${pre}${t})\n`;
  }
  sql = sql + `${pre}select\n`;
  sql =
    sql +
    frame.fields
      .sort((a, b) =>
        a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
      )
      .map(
        (field: FieldData) => `${pre}${t}${getFrameFieldSQL(field)}`,
      )
      .join(",\n") +
    "\n";
  sql = sql + `${pre}from\n`;
  sql =
    sql +
    `${pre}${t}"${frame.parent ? frame.parent.name : model.name}"\n`;
  return sql;
}

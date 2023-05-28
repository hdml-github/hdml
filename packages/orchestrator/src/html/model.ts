import {
  type ModelData,
  type TableData,
  type FieldData,
  type JoinData,
  TableType,
  JoinType,
} from "@hdml/schema";
import { getFieldHTML } from "./fields";
import { getFilterClauseHTML } from "./filter";
import { t } from "../const";

export function getModelHTML(model: ModelData, level = 0): string {
  const tablesList = model.tables
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    .filter((t) => isModelTableJoined(model, t));
  const tables = tablesList
    .map((table: TableData) => {
      switch (table.type) {
        case TableType.Table:
        case TableType.Query:
          return getModelTableHTML(table, level + 1);
        case TableType.Csv:
          return "";
        case TableType.Json:
          return "";
      }
    })
    .join("\n");
  let html = `<hdml-model name="${model.name}">\n` + `${tables}\n`;
  if (model.joins.length > 0) {
    const path = getModelJoinsPath(model.joins);
    html =
      html +
      model.joins
        .map((join, i) => getModelJoinHTML(path, join, i, level + 1))
        .join();
  }
  html = html + "</hdml-model>\n";
  return html;
}

export function isModelTableJoined(
  model: ModelData,
  table: TableData,
): boolean {
  if (model.joins.length === 0) {
    return true;
  }
  let res = false;
  model.joins.forEach((join) => {
    res =
      res || table.name === join.left || table.name === join.right;
  });
  return res;
}

export function getModelTableHTML(
  table: TableData,
  level = 0,
): string {
  const pre = t.repeat(level);
  const fields = table.fields
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    .map((field: FieldData) => `${pre}${t}${getFieldHTML(field)}`)
    .join("\n");
  let type = "";
  switch (table.type) {
    case TableType.Table:
      type = "table";
      break;
    case TableType.Query:
      type = "query";
      break;
    case TableType.Csv:
      type = "csv";
      break;
    case TableType.Json:
      type = "json";
      break;
  }
  let html = `${pre}<hdml-table name="${
    table.name
  }" type="${type}" source="${table.source.replaceAll('"', "`")}">\n`;
  html = html + `${fields}\n`;
  html = html + `${pre}</hdml-table>`;
  return html;
}

export function getModelJoinsPath(joins: JoinData[]): string[] {
  const path = [joins[0].right];
  for (let i = 1; i < joins.length; i++) {
    if (
      joins[i].left !== joins[0].left &&
      path.indexOf(joins[i].left) === -1
    ) {
      path.push(joins[i].left);
    } else {
      path.push(joins[i].right);
    }
  }
  return path;
}

export function getModelJoinHTML(
  path: string[],
  join: JoinData,
  i: number,
  level = 0,
): string {
  const pre = t.repeat(level);
  let html = `${pre}<hdml-join`;
  let type = "";
  switch (join.type) {
    case JoinType.Full:
      type = "full";
      break;
    case JoinType.Left:
      type = "left";
      break;
    case JoinType.Right:
      type = "right";
      break;
    case JoinType.FullOuter:
      type = "full-outer";
      break;
    case JoinType.LeftOuter:
      type = "left-outer";
      break;
    case JoinType.RightOuter:
      type = "right-outer";
      break;
    case JoinType.Inner:
      type = "inner";
      break;
    case JoinType.Cross:
    default:
      type = "cross";
      break;
  }
  html =
    html +
    ` type="${type}"` +
    ` left="${join.left}"` +
    ` right="${join.right}">\n`;
  if (join.type !== JoinType.Cross) {
    html =
      html +
      getFilterClauseHTML(
        join.clause,
        level + 1,
        join.left,
        join.right,
      );
  }
  html = html + `${pre}</hdml-join>\n`;
  return html;
}

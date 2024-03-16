/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  type ModelDef,
  type TableDef,
  type FieldDef,
  type JoinDef,
  TableType,
  JoinType,
} from "@hdml/schema";
import { getFieldHTML } from "./fields";
import { getFilterClauseHTML } from "./filter";
import { t } from "../const";

/**
 * Returns the HTML representation of the `model`.
 */
export function getModelHTML(
  model: ModelDef,
  level = 0,
  isRoot = false,
): string {
  const tablesList = model.tables
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    .filter((t) => isModelTableJoined(model, t));
  const tables = tablesList
    .map((table: TableDef) => {
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
  let html =
    `<hdml-model name="${model.name}"` +
    `${isRoot ? ` root="root"` : ""}>\n` +
    `${tables}\n`;
  if (model.joins.length > 0) {
    const path = getModelJoinsPath(model.joins);
    html =
      html +
      model.joins
        .map((join, i) => getModelJoinHTML(path, join, i, level + 1))
        .join("");
  }
  html = html + "</hdml-model>\n";
  return html;
}

/**
 * Determines if model tables are joined.
 */
export function isModelTableJoined(
  model: ModelDef,
  table: TableDef,
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

/**
 * Returns the HTML representation of the `table`.
 */
export function getModelTableHTML(
  table: TableDef,
  level = 0,
): string {
  const pre = t.repeat(level);
  const fields = table.fields
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    .map((field: FieldDef) => `${pre}${t}${getFieldHTML(field)}`)
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

/**
 * Returns joins path helper object.
 * TODO: optimize this.
 */
export function getModelJoinsPath(joins: JoinDef[]): string[] {
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

/**
 * Returns the HTML representation of the `join`.
 */
export function getModelJoinHTML(
  path: string[],
  join: JoinDef,
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

import {
  type ModelData,
  type TableData,
  type FieldData,
  type JoinData,
  TableType,
  JoinType,
} from "@hdml/schema";
import { getTableFieldSQL } from "./fields";
import { getFilterClauseSQL } from "./filter";
import { t } from "../const";

export function getModelSQL(model: ModelData, level = 0): string {
  const pre = t.repeat(level);
  const tablesList = model.tables
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    .filter((t) => isModelTableJoined(model, t));

  const tables = tablesList
    .map((table: TableData) => {
      switch (table.type) {
        case TableType.Table:
        case TableType.Query:
          return getModelTableSQL(table, level + 2);
        case TableType.Csv:
          return "";
        case TableType.Json:
          return "";
      }
    })
    .join(",\n");

  // subqueries
  let sql = `${pre}${t}with\n`;
  sql = sql + `${tables}\n`;

  // select clause
  sql = sql + `${pre}${t}select\n`;
  sql =
    sql +
    tablesList
      .map((tbl) =>
        tbl.fields
          .map(
            (f) =>
              `${pre}${t}${t}` +
              `"${tbl.name}"."${f.name}" as "${tbl.name}_${f.name}"`,
          )
          .join(",\n"),
      )
      .join(",\n");

  // from clause
  if (model.joins.length === 0) {
    sql = sql + `\n${pre}${t}from\n`;
    sql =
      sql +
      tablesList
        .map((tbl) => `${pre}${t}${t}"${tbl.name}"`)
        .join(",\n");
  } else {
    const path = getModelJoinsPath(model.joins);
    sql =
      sql +
      model.joins
        .map((join, i) => getModelJoinSQL(path, join, i, level))
        .join();
  }

  return sql;
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

export function getModelTableSQL(
  table: TableData,
  level = 0,
): string {
  const pre = t.repeat(level);
  const source =
    table.type === TableType.Table ? table.source : `_${table.name}`;
  const fields = table.fields
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    .map(
      (field: FieldData) =>
        `${pre}${t}${t}${getTableFieldSQL(field)}`,
    )
    .join(",\n");

  let sql = `${pre}"${table.name}" as (\n`;
  sql =
    sql +
    (table.type === TableType.Query
      ? `${pre}${t}with ${source} as (\n` +
        `${table.source
          .split("\n")
          .map((r) => `${pre}${t}${t}${r}`)
          .join("\n")}\n` +
        `${pre}${t})\n`
      : "");
  sql = sql + `${pre}${t}select\n`;
  sql = sql + `${fields}\n`;
  sql = sql + `${pre}${t}from\n`;
  sql = sql + `${pre}${t}${t}${source}\n`;
  sql = sql + `${pre})`;
  return sql;
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

export function getModelJoinSQL(
  path: string[],
  join: JoinData,
  i: number,
  level = 0,
): string {
  const pre = t.repeat(level);
  let sql = "";
  let type = "";
  switch (join.type) {
    case JoinType.Full:
      type = "full join";
      break;
    case JoinType.Left:
      type = "left join";
      break;
    case JoinType.Right:
      type = "right join";
      break;
    case JoinType.FullOuter:
      type = "full outer join";
      break;
    case JoinType.LeftOuter:
      type = "left outer join";
      break;
    case JoinType.RightOuter:
      type = "right outer join";
      break;
    case JoinType.Inner:
      type = "inner join";
      break;
    case JoinType.Cross:
    default:
      type = "cross join";
      break;
  }
  if (i === 0) {
    sql = sql + `\n${pre}${t}from "${join.left}"\n`;
  }
  sql = sql + `${pre}${t}${type} "${path[i]}"\n`;
  if (join.type !== JoinType.Cross) {
    sql = sql + `${pre}${t}on (\n`;
    sql =
      sql +
      getFilterClauseSQL(
        join.clause,
        level + 2,
        join.left,
        join.right,
      );
    sql = sql + `${pre}${t})\n`;
  }
  return sql;
}

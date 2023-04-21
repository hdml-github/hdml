import {
  type ModelData,
  type TableData,
  type FieldData,
  type FilterClauseData,
  type JoinData,
  TableType,
  JoinType,
  FilterType,
  FilterOperator,
} from "@hdml/schema";

import { getTableFieldSQL } from "./fields";
import { getFilterClauseSQL } from "./filter";

export function getModelSQL(model: ModelData): string {
  const tablesList = model.tables
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    .filter((t) => isModelTableJoined(model, t));

  const tables = tablesList
    .map((table: TableData) => {
      switch (table.type) {
        case TableType.Table:
        case TableType.Query:
          return getModelTableSQL(table);
        case TableType.Csv:
          return "";
        case TableType.Json:
          return "";
      }
    })
    .join(",\n");

  // subqueries
  let sql = "\twith\n";
  sql = sql + `${tables}\n`;

  // select clause
  sql = sql + "\t\tselect\n";
  sql =
    sql +
    tablesList
      .map((t) =>
        t.fields
          .map(
            (f) =>
              `\t\t\t` +
              `"${t.name}"."${f.name}" as "${t.name}_${f.name}"`,
          )
          .join(",\n"),
      )
      .join(",\n");

  // from clause
  if (model.joins.length === 0) {
    sql = sql + "\n\t\tfrom\n";
    sql =
      sql + tablesList.map((t) => `\t\t\t"${t.name}"`).join(",\n");
  } else {
    const path = getModelJoinsPath(model.joins);
    sql =
      sql +
      model.joins
        .map((join, i) => getModelJoinSQL(path, join, i))
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

export function getModelTableSQL(table: TableData): string {
  const source =
    table.type === TableType.Table ? table.source : `_${table.name}`;

  const fields = table.fields
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    .map((field: FieldData) => `\t\t\t\t${getTableFieldSQL(field)}`)
    .join(",\n");

  let sql = `\t\t"${table.name}" as (\n`;
  sql =
    sql +
    (table.type === TableType.Query
      ? `\t\t\twith ${source} as (${table.source})\n`
      : "");
  sql = sql + "\t\t\tselect\n";
  sql = sql + `${fields}\n`;
  sql = sql + "\t\t\tfrom\n";
  sql = sql + `\t\t\t\t${source}\n`;
  sql = sql + "\t\t)";
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
): string {
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
    sql = sql + `\n\t\tfrom "${join.left}"\n`;
  }
  sql = sql + `\t\t${type} "${path[i]}"\n`;
  if (join.type !== JoinType.Cross) {
    sql = sql + "\t\ton (\n";
    sql =
      sql + getFilterClauseSQL(join.clause, 7, join.left, join.right);
    sql = sql + "\t\t)\n";
  }
  return sql;
}

export function getModelFilterClauseSQL(
  left: string,
  right: string,
  clause: FilterClauseData,
  level = 0,
): string {
  let sql = "";
  let op = "";
  const t = "\t\t\t" + "\t".repeat(level);
  if (clause.type === FilterOperator.And) {
    sql = sql + `${t}1 = 1\n`;
    op = `${t}and`;
  } else if (clause.type === FilterOperator.Or) {
    sql = sql + `${t}1 != 1\n`;
    op = `${t}or`;
  }
  clause.filters.forEach((filter) => {
    switch (filter.type) {
      case FilterType.Keys:
        sql =
          sql +
          `${op} "${left}"."${filter.options.left}" =` +
          `"${right}"."${filter.options.right}"\n`;
        break;
      case FilterType.Expr:
        sql = sql + `${op} ${filter.options.clause}\n`;
        break;
    }
  });
  clause.children.forEach((child) => {
    sql = sql + `${op} (\n`;
    sql =
      sql + getModelFilterClauseSQL(left, right, child, level + 1);
    sql = sql + `${t})\n`;
  });
  return sql;
}

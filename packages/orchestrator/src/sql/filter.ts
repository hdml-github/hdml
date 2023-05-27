import {
  FilterClauseData,
  FilterData,
  FilterType,
  FilterOperator,
} from "@hdml/schema";
import { t } from "../const";

export function getFilterClauseSQL(
  clause: FilterClauseData,
  level = 0,
  left?: string,
  right?: string,
): string {
  const pre = t.repeat(level);
  let op = "";
  let sql = "";
  switch (clause.type) {
    case FilterOperator.And:
      sql = sql + `${pre}1 = 1\n`;
      op = `${pre}and `;
      break;
    case FilterOperator.Or:
      sql = sql + `${pre}1 != 1\n`;
      op = `${pre}or `;
      break;
    case FilterOperator.None:
    default:
      op = `${pre}`;
      break;
  }
  sql =
    sql +
    clause.filters
      .map((f) => `${op}${getFilter(f, left, right)}\n`)
      .join("");
  clause.children.forEach((child) => {
    sql = sql + `${op}(\n`;
    sql = sql + getFilterClauseSQL(child, level + 1, left, right);
    sql = sql + `${pre})\n`;
  });
  return sql;
}

export function getFilter(
  filter: FilterData,
  left?: string,
  right?: string,
): string {
  switch (filter.type) {
    case FilterType.Keys:
      if (
        !left ||
        !right ||
        !filter.options.left ||
        !filter.options.right
      ) {
        throw new Error("Invalid `Keys` filter.");
      }
      return getKeysFilter(
        left,
        filter.options.left,
        right,
        filter.options.right,
      );
    case FilterType.Expr:
      if (!filter.options.clause) {
        throw new Error("Invalid `Expr` filter.");
      }
      return getExprFilter(filter.options.clause);
    case FilterType.Named:
      return "";
  }
}

export function getKeysFilter(
  lTable: string,
  lField: string,
  rTable: string,
  rField: string,
): string {
  return `"${lTable}"."${lField}" =` + `"${rTable}"."${rField}"`;
}

export function getExprFilter(clause: string): string {
  return clause;
}

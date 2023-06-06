/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  type FilterClauseDef,
  type FilterDef,
  FilterType,
  FilterOperator,
} from "@hdml/schema";
import { t } from "../const";

/**
 * Returns the HTML representation of the filter clause.
 */
export function getFilterClauseHTML(
  clause: FilterClauseDef,
  level = 0,
  left?: string,
  right?: string,
): string {
  const pre = t.repeat(level);
  let open = "";
  let close = "";
  let html = "";
  switch (clause.type) {
    case FilterOperator.And:
      open = `${pre}<hdml-connective operator="and">\n`;
      close = `${pre}</hdml-connective>\n`;
      break;
    case FilterOperator.Or:
      open = `${pre}<hdml-connective operator="or">\n`;
      close = `${pre}</hdml-connective>\n`;
      break;
    case FilterOperator.None:
    default:
      open = "";
      close = "";
      break;
  }
  html =
    html +
    open +
    clause.filters
      .map((f) => `${pre}${t}${getFilter(f, left, right)}\n`)
      .join("");
  clause.children.forEach((child) => {
    html = html + getFilterClauseHTML(child, level + 1, left, right);
  });
  html = html + `${close}`;
  return html;
}

/**
 * Returns the HTML representation of the `filter`.
 */
export function getFilter(
  filter: FilterDef,
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
      return getKeysFilter(filter.options.left, filter.options.right);
    case FilterType.Expr:
      if (!filter.options.clause) {
        throw new Error("Invalid `Expr` filter.");
      }
      return getExprFilter(filter.options.clause);
    case FilterType.Named:
      return "";
  }
}

/**
 * Returns the HTML representation of the keys filter.
 */
export function getKeysFilter(
  lField: string,
  rField: string,
): string {
  return (
    `<hdml-filter type="keys" left="${lField}" ` +
    `right="${rField}"></hdml-filter>`
  );
}

/**
 * Returns the HTML representation of the expression filter.
 */
export function getExprFilter(clause: string): string {
  return `<hdml-filter type="expr" clause="${clause.replaceAll(
    '"',
    "`",
  )}"></hdml-filter>`;
}

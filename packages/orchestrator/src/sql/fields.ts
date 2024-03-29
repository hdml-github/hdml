/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  type FieldDef,
  type TypeDef,
  DataType,
  AggType,
} from "@hdml/schema";

/**
 * Returns the SQL representation of the table field.
 */
export function getTableFieldSQL(field: FieldDef): string {
  if (!field.type) {
    return getNamedField(
      field.name,
      getPlainClause(field.name, field.origin, field.clause),
    );
  } else {
    return getNamedField(
      field.name,
      getCastedClause(
        getPlainClause(field.name, field.origin, field.clause),
        field.type,
      ),
    );
  }
}

/**
 * Returns the SQL representation of the frame field.
 */
export function getFrameFieldSQL(field: FieldDef): string {
  if (!field.type) {
    return getNamedField(
      field.name,
      getGroupedClause(
        getPlainClause(field.name, field.origin, field.clause),
        field.agg,
      ),
    );
  } else {
    return getNamedField(
      field.name,
      getGroupedClause(
        getCastedClause(
          getPlainClause(field.name, field.origin, field.clause),
          field.type,
        ),
        field.agg,
      ),
    );
  }
}

/**
 * Returns the SQL representation of the named field.
 */
export function getNamedField(name: string, clause: string): string {
  return `${clause} as "${name}"`;
}

/**
 * Returns the SQL clause.
 */
export function getPlainClause(
  name: string,
  origin?: string,
  clause?: string,
): string {
  return clause ? clause : `"${origin || name}"`;
}

/**
 * Returns the SQL couped clause.
 */
export function getGroupedClause(
  clause: string,
  agg?: AggType,
): string {
  switch (agg) {
    case AggType.Count:
      clause = `count(${clause})`;
      break;
    case AggType.CountDistinct:
      clause = `count(distinct ${clause})`;
      break;
    case AggType.CountDistinctApprox:
      clause = `approx_distinct(${clause})`;
      break;
    case AggType.Min:
      clause = `min(${clause})`;
      break;
    case AggType.Max:
      clause = `max(${clause})`;
      break;
    case AggType.Sum:
      clause = `sum(${clause})`;
      break;
    case AggType.Avg:
      clause = `avg(${clause})`;
      break;
    case AggType.None:
    case undefined:
    default:
      break;
  }
  return clause;
}

/**
 * Returns the SQL casted clause.
 */
export function getCastedClause(
  clause: string,
  type: TypeDef,
): string {
  let sql = "";
  switch (type.type) {
    case DataType.Int8:
    case DataType.Uint8:
      sql = `try_cast(${clause} as tinyint)`;
      break;
    case DataType.Int16:
    case DataType.Uint16:
      sql = `try_cast(${clause} as smallint)`;
      break;
    case DataType.Int32:
    case DataType.Uint32:
      sql = `try_cast(${clause} as integer)`;
      break;
    case DataType.Int64:
    case DataType.Uint64:
      sql = `try_cast(${clause} as bigint)`;
      break;
    case DataType.Float16:
    case DataType.Float32:
      sql = `try_cast(${clause} as real)`;
      break;
    case DataType.Float64:
      sql = `try_cast(${clause} as double)`;
      break;
    case DataType.Decimal:
      sql =
        `try_cast(${clause} as ` +
        `decimal(${type.options.scale}, ` +
        `${type.options.precision}))`;
      break;
    case DataType.Date:
      sql = `try_cast(${clause} as date)`;
      break;
    case DataType.Time:
      sql = `try_cast(${clause} as time)`;
      break;
    case DataType.Timestamp:
      sql = `try_cast(${clause} as timestamp)`;
      break;
    case DataType.Binary:
      sql = `try_cast(${clause} as varbinary)`;
      break;
    case DataType.Utf8:
      sql = `try_cast(${clause} as varchar)`;
      break;
  }
  return sql;
}

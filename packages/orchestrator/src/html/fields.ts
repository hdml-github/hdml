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
 * Returns the HTML representation of the field.
 */
export function getFieldHTML(
  field: FieldDef,
  withOrdering = false,
): string {
  let result = `<hdml-field name="${field.name}"`;
  if (field.origin) {
    result = result + ` origin="${field.origin}"`;
  }
  if (field.clause) {
    result =
      result + ` clause="${field.clause.replaceAll('"', "`")}"`;
  }
  if (field.type) {
    result = result + getType(field.type);
  }
  if (field.agg) {
    result = result + getAgg(field.agg);
  }
  if (withOrdering) {
    result = result + (field.asc ? ` asc="true"` : ` asc="false"`);
  }
  result = result + "></hdml-field>";
  return result;
}

/**
 * Returns the HTML representation of the field's type.
 */
export function getType(type: TypeDef): string {
  switch (type.type) {
    case DataType.Int8:
      return ` type="int-8"`;
    case DataType.Uint8:
      return ` type="uint-8"`;
    case DataType.Int16:
      return ` type="int-16"`;
    case DataType.Uint16:
      return ` type="uint-16"`;
    case DataType.Int32:
      return ` type="int-32"`;
    case DataType.Uint32:
      return ` type="uint-32"`;
    case DataType.Int64:
      return ` type="int-64"`;
    case DataType.Uint64:
      return ` type="uint-64"`;
    case DataType.Float16:
      return ` type="float-16"`;
    case DataType.Float32:
      return ` type="float-32"`;
    case DataType.Float64:
      return ` type="float-64"`;
    case DataType.Decimal:
      return (
        ` type="decimal"` +
        ` scale="${type.options.scale}"` +
        ` precision="${type.options.precision}"`
      );
    case DataType.Date:
      return ` type="date"`;
    case DataType.Time:
      return ` type="time"`;
    case DataType.Timestamp:
      return ` type="timestamp"`;
    case DataType.Binary:
      return ` type="binary"`;
    case DataType.Utf8:
      return ` type="utf-8"`;
  }
}

/**
 * Returns the HTML representation of the aggregation function.
 */
export function getAgg(agg: AggType): string {
  switch (agg) {
    case AggType.Count:
      return ` agg="count"`;
    case AggType.CountDistinct:
      return ` agg="countDistinct"`;
    case AggType.CountDistinctApprox:
      return ` agg="countDistinctApprox"`;
    case AggType.Min:
      return ` agg="min"`;
    case AggType.Max:
      return ` agg="max"`;
    case AggType.Sum:
      return ` agg="sum"`;
    case AggType.Avg:
      return ` agg="avg"`;
    case AggType.None:
    case undefined:
    default:
      return "";
  }
}

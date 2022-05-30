/**
 * @fileoverview Declaration of the getDataType function.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { arrow } from "@hdml/database";
import { DataFieldType } from "../components/DataField";

type SimpleDataType =
  | arrow.Int8
  | arrow.Int16
  | arrow.Int32
  | arrow.Int64
  | arrow.Uint8
  | arrow.Uint16
  | arrow.Uint32
  | arrow.Uint64
  | arrow.Float16
  | arrow.Float32
  | arrow.Float64
  | arrow.Binary
  | arrow.Utf8;

type SimpleDataTypeConstructor = new () => SimpleDataType;

type DecimalDataTypeConstructor = new (
  scale: number,
  precision: number,
  bitWidth: number,
) => arrow.Decimal;

type TimestampDataTypeConstructor = new (
  unit: arrow.TimeUnit,
  timezone?: null | string,
) => arrow.Timestamp;

function getConstructor(
  type: string,
):
  | false
  | SimpleDataTypeConstructor
  | DecimalDataTypeConstructor
  | TimestampDataTypeConstructor {
  switch (type) {
    case "int-8":
      return arrow.Int8;
    case "int-16":
      return arrow.Int16;
    case "int-32":
      return arrow.Int32;
    case "int-64":
      return arrow.Int64;
    case "uint-8":
      return arrow.Uint8;
    case "uint-16":
      return arrow.Uint16;
    case "uint-32":
      return arrow.Uint32;
    case "uint-64":
      return arrow.Uint64;
    case "float-16":
      return arrow.Float16;
    case "float-32":
      return arrow.Float32;
    case "float-64":
      return arrow.Float64;
    case "binary":
      return arrow.Binary;
    case "utf-8":
      return arrow.Utf8;
    case "decimal":
      return arrow.Decimal;
    case "timestamp":
      return arrow.Timestamp;
    // case "date":
    //   return arrow.DateDay
    // case "time":
    //   return arrow.Time;
    default:
      console.error(`unknown data-field type: ${type}`);
      return false;
  }
}

function getSimpleDataType(
  DataType: SimpleDataTypeConstructor,
): SimpleDataType {
  return new DataType();
}

function getDecimalDataType(
  Decimal: DecimalDataTypeConstructor,
  scale: number,
  precision: number,
  bitWidth: number,
): arrow.Decimal {
  return new Decimal(scale, precision, bitWidth);
}

function getTimestampDataType(
  Timestamp: TimestampDataTypeConstructor,
  ustring: string,
  timezone?: null | string,
): false | arrow.Timestamp {
  switch (ustring) {
    case "second":
      return new Timestamp(arrow.TimeUnit.SECOND, timezone);
    case "millisecond":
      return new Timestamp(arrow.TimeUnit.MILLISECOND, timezone);
    case "microsecond":
      return new Timestamp(arrow.TimeUnit.MICROSECOND, timezone);
    case "nanosecond":
      return new Timestamp(arrow.TimeUnit.NANOSECOND, timezone);
    default:
      console.error(`unknown timestamp unit: ${ustring}`);
      return false;
  }
}

export function getDataType(
  fieldType: DataFieldType,
): false | SimpleDataType | arrow.Decimal | arrow.Timestamp {
  switch (fieldType.type) {
    case "int-8":
    case "int-16":
    case "int-32":
    case "int-64":
    case "uint-8":
    case "uint-16":
    case "uint-32":
    case "uint-64":
    case "float-16":
    case "float-32":
    case "float-64":
    case "binary":
    case "utf-8":
      return getSimpleDataType(
        getConstructor(fieldType.type) as SimpleDataTypeConstructor,
      );
    case "decimal":
      return getDecimalDataType(
        getConstructor(fieldType.type) as DecimalDataTypeConstructor,
        fieldType.scale as number,
        fieldType.precision as number,
        fieldType.bitWidth as number,
      );
    case "timestamp":
      return getTimestampDataType(
        getConstructor(
          fieldType.type,
        ) as TimestampDataTypeConstructor,
        fieldType.unit as string,
        fieldType.timezone,
      );
    // case "date":
    //   return arrow.DateDay
    // case "time":
    //   return arrow.Time;
    default:
      console.error(`unknown data-field type: ${fieldType.type}`);
      return false;
  }
}

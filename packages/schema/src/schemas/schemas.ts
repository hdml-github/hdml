/**
 * @fileoverview TableService class definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import Ajv from "ajv";

import Int8 from "./definitions/types/int-8";
import Int16 from "./definitions/types/int-16";
import Int32 from "./definitions/types/int-32";
import Int64 from "./definitions/types/int-64";

import Uint8 from "./definitions/types/uint-8";
import Uint16 from "./definitions/types/uint-16";
import Uint32 from "./definitions/types/uint-32";
import Uint64 from "./definitions/types/uint-64";

import Float16 from "./definitions/types/float-16";
import Float32 from "./definitions/types/float-32";
import Float64 from "./definitions/types/float-64";

import Decimal128 from "./definitions/types/decimal-128";
import Decimal256 from "./definitions/types/decimal-256";

import Date32 from "./definitions/types/date-32";
import Date64 from "./definitions/types/date-64";

import Time32 from "./definitions/types/time-32";
import Time64 from "./definitions/types/time-64";
import TimeStamp from "./definitions/types/time-stamp";

import BitData from "./definitions/types/bit-data";
import Utf8data from "./definitions/types/utf8-data";
import BinaryData from "./definitions/types/binary-data";

import DataColumns from "./definitions/data-columns";
import HdmlTable, { HdmlTableSchema } from "./definitions/hdml-table";

const schemas = new Ajv({
  schemas: [
    Int8,
    Int16,
    Int32,
    Int64,
    Uint8,
    Uint16,
    Uint32,
    Uint64,
    Float16,
    Float32,
    Float64,
    Decimal128,
    Decimal256,
    Date32,
    Date64,
    Time32,
    Time64,
    TimeStamp,
    BitData,
    Utf8data,
    BinaryData,
    DataColumns,
    HdmlTable,
  ],
});
export default schemas;
export { HdmlTableSchema };

import { DataType } from "./list.DataType";
import { DecimalBitWidth } from "./list.DecimalBitWidth";
import { DateUnit } from "./list.DateUnit";
import { TimeUnit } from "./list.TimeUnit";
import { TimeZone } from "./list.TimeZone";

const SimpleList = DataType.splice(0, 13);
const DecimalList = DataType.splice(0, 1);
const DateList = DataType.splice(0, 1);
const TimeList = DataType.splice(0, 1);
const TimestampList = DataType.splice(0, 1);

export const SimpleType = {
  title: "Simple type",
  description: "Simple types schema.",
  type: "object",
  required: ["type", "nullable"],
  properties: {
    type: {
      title: "type",
      description: "Field type.",
      type: "string",
      enum: SimpleList,
    },
    nullable: {
      title: "nullable",
      description: "Field nullable flag.",
      type: "boolean",
    },
  },
};

export const DecimalType = {
  title: "Decimal type",
  description: "Decimal types schema.",
  type: "object",
  required: ["type", "nullable", "scale", "precision", "bitWidth"],
  properties: {
    type: {
      title: "type",
      description: "Field type.",
      type: "string",
      enum: DecimalList,
    },
    nullable: {
      title: "nullable",
      description: "Field nullable flag.",
      type: "boolean",
    },
    scale: {
      title: "scale",
      description: "Decimal field scale.",
      type: "integer",
    },
    precision: {
      title: "precision",
      description: "Decimal field precision.",
      type: "integer",
    },
    bitWidth: {
      title: "precision",
      description: "Decimal field bit width.",
      type: "integer",
      enum: DecimalBitWidth,
    },
  },
};

export const DateType = {
  title: "Date type",
  description: "Date type schema.",
  type: "object",
  required: ["type", "nullable", "unit"],
  properties: {
    type: {
      title: "type",
      description: "Field type.",
      type: "string",
      enum: DateList,
    },
    nullable: {
      title: "nullable",
      description: "Field nullable flag.",
      type: "boolean",
    },
    unit: {
      title: "unit",
      description: "Date unit.",
      type: "string",
      enum: DateUnit,
    },
  },
};

export const TimeType = {
  title: "Time type",
  description: "Time type schema.",
  type: "object",
  required: ["type", "nullable", "unit"],
  properties: {
    type: {
      title: "type",
      description: "Field type.",
      type: "string",
      enum: TimeList,
    },
    nullable: {
      title: "nullable",
      description: "Field nullable flag.",
      type: "boolean",
    },
    unit: {
      title: "unit",
      description: "Time unit.",
      type: "string",
      enum: TimeUnit,
    },
  },
};

export const TimestampType = {
  title: "Timestamp type",
  description: "Timestamp type schema.",
  type: "object",
  required: ["type", "nullable", "unit"],
  properties: {
    type: {
      title: "type",
      description: "Field type.",
      type: "string",
      enum: TimestampList,
    },
    nullable: {
      title: "nullable",
      description: "Field nullable flag.",
      type: "boolean",
    },
    unit: {
      title: "unit",
      description: "Time unit.",
      type: "string",
      enum: TimeUnit,
    },
    timezone: {
      title: "timezone",
      description: "Timestamp timezone.",
      type: "string",
      enum: TimeZone,
    },
  },
};

export const Type = {
  title: "Field type",
  description: "Field type schema.",
  type: "object",
  oneOf: [SimpleType, DecimalType, DateType, TimeType, TimestampType],
};

export const Source = {
  title: "Field source",
  description: "Field source schema.",
  type: "object",
  oneOf: [
    {
      title: "origin",
      description: "Field origin schema.",
      type: "string",
      pattern: "^[\\w\\-.]{1,64}",
    },
    {
      title: "clause",
      description: "Field clause.",
      type: "string",
    },
  ],
};

export const Field = {
  title: "Common opts",
  description: "Common opts schema.",
  type: "object",
  required: ["name"],
  properties: {
    name: {
      title: "name",
      description: "Field name.",
      type: "string",
      pattern: "^[\\w\\-.]{1,64}",
    },
    description: {
      title: "description",
      description: "Field description.",
      type: "string",
    },
    type: Type,
    source: Source,
  },
};

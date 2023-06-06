/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Builder } from "flatbuffers";
import {
  Field,
  Type,
  TypeOpts,
  TimestampOpts,
  TimeOpts,
  DateOpts,
  DecimalOpts,
  CommonOpts,
} from "../.fbs/query.Field_generated";
import {
  AggType,
  DateUnit,
  TimeUnit,
  TimeZone,
  DataType,
  DecBitWidth,
} from "../enums";

/**
 * An object for defining field common type options.
 */
export type CommonOptsDef = {
  nullable: boolean;
};

/**
 * An object for defining field decimal type options.
 */
export type DecimalOptsDef = {
  nullable: boolean;
  scale: number;
  precision: number;
  bitWidth: DecBitWidth;
};

/**
 * An object for defining field date type options.
 */
export type DateOptsDef = {
  nullable: boolean;
  unit: DateUnit;
};

/**
 * An object for defining field time type options.
 */
export type TimeOptsDef = {
  nullable: boolean;
  unit: TimeUnit;
};

/**
 * An object for defining field timestamp type options.
 */
export type TimestampOptsDef = {
  nullable: boolean;
  unit: TimeUnit;
  timezone: TimeZone;
};

/**
 * An object for defining field type.
 */
export type TypeDef =
  | {
      type:
        | DataType.Int8
        | DataType.Int16
        | DataType.Int32
        | DataType.Int64
        | DataType.Uint8
        | DataType.Uint16
        | DataType.Uint32
        | DataType.Uint64
        | DataType.Float16
        | DataType.Float32
        | DataType.Float64
        | DataType.Binary
        | DataType.Utf8;
      options: CommonOptsDef;
    }
  | {
      type: DataType.Decimal;
      options: DecimalOptsDef;
    }
  | {
      type: DataType.Date;
      options: DateOptsDef;
    }
  | {
      type: DataType.Time;
      options: TimeOptsDef;
    }
  | {
      type: DataType.Timestamp;
      options: TimestampOptsDef;
    };

/**
 * An object for defining field.
 */
export type FieldDef = {
  description?: string;
  origin?: string;
  clause?: string;
  name: string;
  type?: TypeDef;
  agg?: AggType;
  asc?: boolean;
};

/**
 * Field helper class.
 */
export class FieldHelper {
  public constructor(private _builder: Builder) {}

  public bufferizeFields(data: FieldDef[]): number[] {
    return data.map((f) => this.bufferizeField(f));
  }

  public bufferizeField(data: FieldDef): number {
    const name = this._builder.createString(data.name);
    const origin = data.origin
      ? this._builder.createString(data.origin)
      : false;
    const clause = data.clause
      ? this._builder.createString(data.clause)
      : false;
    const description = data.description
      ? this._builder.createString(data.description)
      : false;
    const type = data.type ? this.bufferizeType(data.type) : false;
    Field.startField(this._builder);
    Field.addName(this._builder, name);
    if (origin) {
      Field.addOrigin(this._builder, origin);
    }
    if (clause) {
      Field.addClause(this._builder, clause);
    }
    if (description) {
      Field.addDescription(this._builder, description);
    }
    if (data.agg) {
      Field.addAgg(this._builder, data.agg);
    }
    if (typeof data.asc === "boolean") {
      Field.addAsc(this._builder, data.asc);
    } else {
      Field.addAsc(this._builder, true);
    }
    if (type) {
      Field.addType(this._builder, type);
    }
    return Field.endField(this._builder);
  }

  public bufferizeType(data: TypeDef): number {
    let opts: number;
    let type: TypeOpts = TypeOpts.NONE;
    switch (data.type) {
      default:
        type = TypeOpts.NONE;
        opts = 0;
        break;
      case DataType.Int8:
      case DataType.Int16:
      case DataType.Int32:
      case DataType.Int64:
      case DataType.Uint8:
      case DataType.Uint16:
      case DataType.Uint32:
      case DataType.Uint64:
      case DataType.Float16:
      case DataType.Float32:
      case DataType.Float64:
      case DataType.Binary:
      case DataType.Utf8:
        type = TypeOpts.CommonOpts;
        opts = this.bufferizeCommonOpts(data.options);
        break;
      case DataType.Decimal:
        type = TypeOpts.DecimalOpts;
        opts = this.bufferizeDecimalOpts(data.options);
        break;
      case DataType.Date:
        type = TypeOpts.DateOpts;
        opts = this.bufferizeDateOpts(data.options);
        break;
      case DataType.Time:
        type = TypeOpts.TimeOpts;
        opts = this.bufferizeTimeOpts(data.options);
        break;
      case DataType.Timestamp:
        type = TypeOpts.TimestampOpts;
        opts = this.bufferizeTimestampOpts(data.options);
        break;
    }
    Type.startType(this._builder);
    Type.addType(this._builder, data.type);
    Type.addOptionsType(this._builder, type);
    Type.addOptions(this._builder, opts);
    return Type.endType(this._builder);
  }

  public bufferizeCommonOpts(data: CommonOptsDef): number {
    return CommonOpts.createCommonOpts(this._builder, data.nullable);
  }

  public bufferizeDecimalOpts(data: DecimalOptsDef): number {
    return DecimalOpts.createDecimalOpts(
      this._builder,
      data.nullable,
      data.scale,
      data.precision,
      data.bitWidth,
    );
  }

  public bufferizeDateOpts(data: DateOptsDef): number {
    return DateOpts.createDateOpts(
      this._builder,
      data.nullable,
      data.unit,
    );
  }

  public bufferizeTimeOpts(data: TimeOptsDef): number {
    return TimeOpts.createTimeOpts(
      this._builder,
      data.nullable,
      data.unit,
    );
  }

  public bufferizeTimestampOpts(data: TimestampOptsDef): number {
    return TimestampOpts.createTimestampOpts(
      this._builder,
      data.nullable,
      data.unit,
      data.timezone,
    );
  }

  public parseFields(
    fieldGetter: (index: number, obj?: Field) => Field | null,
    length: number,
  ): FieldDef[] {
    const fields: FieldDef[] = [];
    for (let j = 0; j < length; j++) {
      const field = fieldGetter(j, new Field());
      if (field) {
        fields.push({
          name: field.name() || "",
          clause: field.clause() || undefined,
          origin: field.origin() || undefined,
          description: field.description() || undefined,
          agg: field.agg(),
          asc: field.asc(),
          type: this.parseType(field.type(new Type())),
        });
      }
    }
    return fields;
  }

  public parseType(type: null | Type): TypeDef | undefined {
    if (!type) {
      return;
    }
    let data: TypeDef | undefined = undefined;
    let options: unknown;
    switch (type.optionsType()) {
      case TypeOpts.CommonOpts:
        options = type.options(new CommonOpts());
        data = {
          type: <
            | DataType.Int8
            | DataType.Int16
            | DataType.Int32
            | DataType.Int64
            | DataType.Uint8
            | DataType.Uint16
            | DataType.Uint32
            | DataType.Uint64
            | DataType.Float16
            | DataType.Float32
            | DataType.Float64
            | DataType.Binary
            | DataType.Utf8
          >type.type(),
          options: {
            nullable: (<CommonOpts>options).nullable(),
          },
        };
        break;
      case TypeOpts.DecimalOpts:
        options = type.options(new DecimalOpts());
        data = {
          type: <DataType.Decimal>type.type(),
          options: {
            nullable: (<DecimalOpts>options).nullable(),
            scale: (<DecimalOpts>options).scale(),
            precision: (<DecimalOpts>options).precision(),
            bitWidth: (<DecimalOpts>options).bitWidth(),
          },
        };
        break;
      case TypeOpts.DateOpts:
        options = type.options(new DateOpts());
        data = {
          type: <DataType.Date>type.type(),
          options: {
            nullable: (<DateOpts>options).nullable(),
            unit: (<DateOpts>options).unit(),
          },
        };
        break;
      case TypeOpts.TimeOpts:
        options = type.options(new TimeOpts());
        data = {
          type: <DataType.Time>type.type(),
          options: {
            nullable: (<TimeOpts>options).nullable(),
            unit: (<TimeOpts>options).unit(),
          },
        };
        break;
      case TypeOpts.TimestampOpts:
        options = type.options(new TimestampOpts());
        data = {
          type: <DataType.Timestamp>type.type(),
          options: {
            nullable: (<TimestampOpts>options).nullable(),
            unit: (<TimestampOpts>options).unit(),
            timezone: (<TimestampOpts>options).timezone(),
          },
        };
        break;
    }
    return data;
  }
}

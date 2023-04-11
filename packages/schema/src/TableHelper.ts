import { Builder } from "flatbuffers";
import { Table, Model } from "./.fbs/data.Model_generated";
import {
  Field,
  Type,
  TypeOpts,
  TimestampOpts,
  TimeOpts,
  DateOpts,
  DecimalOpts,
  CommonOpts,
} from "./.fbs/data.Field_generated";

import {
  TableType,
  AggType,
  DateUnit,
  TimeUnit,
  TimeZone,
  DataType,
  DecimalBitWidth,
} from "./Enums";

export type CommonOptsData = {
  nullable: boolean;
};

export type DecimalOptsData = {
  nullable: boolean;
  scale: number;
  precision: number;
  bitWidth: DecimalBitWidth;
};

export type DateOptsData = {
  nullable: boolean;
  unit: DateUnit;
};

export type TimeOptsData = {
  nullable: boolean;
  unit: TimeUnit;
};

export type TimestampOptsData = {
  nullable: boolean;
  unit: TimeUnit;
  timezone: TimeZone;
};

export type TypeData =
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
      options: CommonOptsData;
    }
  | {
      type: DataType.Decimal;
      options: DecimalOptsData;
    }
  | {
      type: DataType.Date;
      options: DateOptsData;
    }
  | {
      type: DataType.Time;
      options: TimeOptsData;
    }
  | {
      type: DataType.Timestamp;
      options: TimestampOptsData;
    };

export type FieldData = {
  description?: string;
  origin?: string;
  clause?: string;
  name: string;
  type?: TypeData;
  agg?: AggType;
  asc?: boolean;
};

export type TableData = {
  name: string;
  type: TableType;
  source: string;
  fields: FieldData[];
};

export class TableHelper {
  public constructor(private _builder: Builder) {}

  public bufferizeTables(data: TableData[]): number[] {
    return data.map((t) => this.bufferizeTable(t));
  }

  public bufferizeTable(data: TableData): number {
    const name = this._builder.createString(data.name);
    const source = this._builder.createString(data.source);
    const offsets = this.bufferizeFields(data.fields);
    const fields = Table.createFieldsVector(this._builder, offsets);

    Table.startTable(this._builder);
    Table.addName(this._builder, name);
    Table.addSource(this._builder, source);
    Table.addType(this._builder, data.type);
    Table.addFields(this._builder, fields);

    return Table.endTable(this._builder);
  }

  public bufferizeFields(data: FieldData[]): number[] {
    return data.map((f) => this.bufferizeField(f));
  }

  public bufferizeField(data: FieldData): number {
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

  public bufferizeType(data: TypeData): number {
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

  public bufferizeCommonOpts(data: CommonOptsData): number {
    return CommonOpts.createCommonOpts(this._builder, data.nullable);
  }

  public bufferizeDecimalOpts(data: DecimalOptsData): number {
    return DecimalOpts.createDecimalOpts(
      this._builder,
      data.nullable,
      data.scale,
      data.precision,
      data.bitWidth,
    );
  }

  public bufferizeDateOpts(data: DateOptsData): number {
    return DateOpts.createDateOpts(
      this._builder,
      data.nullable,
      data.unit,
    );
  }

  public bufferizeTimeOpts(data: TimeOptsData): number {
    return TimeOpts.createTimeOpts(
      this._builder,
      data.nullable,
      data.unit,
    );
  }

  public bufferizeTimestampOpts(data: TimestampOptsData): number {
    return TimestampOpts.createTimestampOpts(
      this._builder,
      data.nullable,
      data.unit,
      data.timezone,
    );
  }

  public parseTables(model: Model): TableData[] {
    const tables: TableData[] = [];
    for (let i = 0; i < model.tablesLength(); i++) {
      const table = model.tables(i, new Table());
      if (table) {
        tables.push({
          name: table.name() || "",
          type: table.type(),
          source: table.source() || "",
          fields: this.parseFields(table),
        });
      }
    }
    return tables;
  }

  public parseFields(table: Table): FieldData[] {
    const fields: FieldData[] = [];
    for (let j = 0; j < table.fieldsLength(); j++) {
      const field = table.fields(j, new Field());
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

  public parseType(type: null | Type): TypeData | undefined {
    if (!type) {
      return;
    }
    let data: TypeData | undefined = undefined;
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

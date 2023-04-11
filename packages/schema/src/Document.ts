import { ByteBuffer, Builder } from "flatbuffers";
import { Doc } from "./.fbs/data.Doc_generated";
import { Model } from "./.fbs/data.Model_generated";
import { Table } from "./.fbs/data.Model_generated";
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

export type ModelData = {
  name: string;
  host: string;
  tables: TableData[];
};

export type DocumentData =
  | Uint8Array
  | {
      name: string;
      tenant: string;
      token: string;
      model: ModelData;
    };

export class Document {
  private _buffer: ByteBuffer;
  private _builder: Builder;
  private _document: Doc;

  public get buffer(): Uint8Array {
    return this._buffer.bytes();
  }

  public get name(): string {
    return this._document.name() || "";
  }

  public get tenant(): string {
    return this._document.tenant() || "";
  }

  public get token(): string {
    return this._document.token() || "";
  }

  public get model(): undefined | ModelData {
    const model = this._document.model(new Model());
    if (model) {
      return {
        name: model.name() || "",
        host: model.host() || "",
        tables: this._parseTables(model),
      };
    }
    return;
  }

  constructor(data: DocumentData) {
    this._builder = new Builder(1024);
    if (data instanceof Uint8Array) {
      this._buffer = new ByteBuffer(data);
      this._document = Doc.getRootAsDoc(this._buffer);
    } else {
      const name = this._builder.createString(data.name);
      const tenant = this._builder.createString(data.tenant);
      const token = this._builder.createString(data.token);
      const model = this._bufferizeModel(data.model);

      Doc.startDoc(this._builder);
      Doc.addName(this._builder, name);
      Doc.addTenant(this._builder, tenant);
      Doc.addToken(this._builder, token);
      Doc.addModel(this._builder, model);

      this._builder.finish(Doc.endDoc(this._builder));
      this._buffer = new ByteBuffer(this._builder.asUint8Array());
      this._document = Doc.getRootAsDoc(this._buffer);
    }
  }

  private _bufferizeModel(data: ModelData): number {
    const name = this._builder.createString(data.name);
    const host = this._builder.createString(data.host);
    const offsets = this._bufferizeTables(data.tables);
    const tables = Model.createTablesVector(this._builder, offsets);

    Model.startModel(this._builder);
    Model.addName(this._builder, name);
    Model.addHost(this._builder, host);
    Model.addTables(this._builder, tables);

    return Model.endModel(this._builder);
  }

  private _bufferizeTables(data: TableData[]): number[] {
    return data.map((t) => this._bufferizeTable(t));
  }

  private _bufferizeTable(data: TableData): number {
    const name = this._builder.createString(data.name);
    const source = this._builder.createString(data.source);
    const offsets = this._bufferizeFields(data.fields);
    const fields = Table.createFieldsVector(this._builder, offsets);

    Table.startTable(this._builder);
    Table.addName(this._builder, name);
    Table.addSource(this._builder, source);
    Table.addType(this._builder, data.type);
    Table.addFields(this._builder, fields);

    return Table.endTable(this._builder);
  }

  private _bufferizeFields(data: FieldData[]): number[] {
    return data.map((f) => this._bufferizeField(f));
  }

  private _bufferizeField(data: FieldData): number {
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
    const type = data.type ? this._bufferizeType(data.type) : false;

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

  private _bufferizeType(data: TypeData): number {
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
        opts = this._bufferizeCommonOpts(data.options);
        break;
      case DataType.Decimal:
        type = TypeOpts.DecimalOpts;
        opts = this._bufferizeDecimalOpts(data.options);
        break;
      case DataType.Date:
        type = TypeOpts.DateOpts;
        opts = this._bufferizeDateOpts(data.options);
        break;
      case DataType.Time:
        type = TypeOpts.TimeOpts;
        opts = this._bufferizeTimeOpts(data.options);
        break;
      case DataType.Timestamp:
        type = TypeOpts.TimestampOpts;
        opts = this._bufferizeTimestampOpts(data.options);
        break;
    }
    Type.startType(this._builder);
    Type.addType(this._builder, data.type);
    Type.addOptionsType(this._builder, type);
    Type.addOptions(this._builder, opts);
    return Type.endType(this._builder);
  }

  private _bufferizeCommonOpts(data: CommonOptsData): number {
    return CommonOpts.createCommonOpts(this._builder, data.nullable);
  }

  private _bufferizeDecimalOpts(data: DecimalOptsData): number {
    return DecimalOpts.createDecimalOpts(
      this._builder,
      data.nullable,
      data.scale,
      data.precision,
      data.bitWidth,
    );
  }

  private _bufferizeDateOpts(data: DateOptsData): number {
    return DateOpts.createDateOpts(
      this._builder,
      data.nullable,
      data.unit,
    );
  }

  private _bufferizeTimeOpts(data: TimeOptsData): number {
    return TimeOpts.createTimeOpts(
      this._builder,
      data.nullable,
      data.unit,
    );
  }

  private _bufferizeTimestampOpts(data: TimestampOptsData): number {
    return TimestampOpts.createTimestampOpts(
      this._builder,
      data.nullable,
      data.unit,
      data.timezone,
    );
  }

  private _parseTables(model: Model): TableData[] {
    const tables: TableData[] = [];
    for (let i = 0; i < model.tablesLength(); i++) {
      const table = model.tables(i, new Table());
      if (table) {
        tables.push({
          name: table.name() || "",
          type: table.type(),
          source: table.source() || "",
          fields: this._parseFields(table),
        });
      }
    }
    return tables;
  }

  private _parseFields(table: Table): FieldData[] {
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
          type: this._parseType(field.type(new Type())),
        });
      }
    }
    return fields;
  }

  private _parseType(type: null | Type): TypeData | undefined {
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

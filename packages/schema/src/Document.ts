import { ByteBuffer, Builder } from "flatbuffers";
import { Doc } from "./.fbs/data.Doc_generated";
import { Model } from "./.fbs/data.Model_generated";
import { TableHelper, TableData } from "./TableHelper";
import { JoinHelper, JoinData } from "./JoinHelper";

export type ModelData = {
  name: string;
  host: string;
  tables: TableData[];
  joins: JoinData[];
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
  private _table: TableHelper;
  private _join: JoinHelper;

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
        tables: this._table.parseTables(model),
        joins: this._join.parseJoins(model),
      };
    }
    return;
  }

  constructor(data: DocumentData) {
    this._builder = new Builder(1024);
    this._table = new TableHelper(this._builder);
    this._join = new JoinHelper(this._builder);
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
    const tables_ = this._table.bufferizeTables(data.tables);
    const tables = Model.createTablesVector(this._builder, tables_);
    const joins_ = this._join.bufferizeJoins(data.joins);
    const joins = Model.createJoinsVector(this._builder, joins_);
    Model.startModel(this._builder);
    Model.addName(this._builder, name);
    Model.addHost(this._builder, host);
    Model.addTables(this._builder, tables);
    Model.addJoins(this._builder, joins);
    return Model.endModel(this._builder);
  }
}

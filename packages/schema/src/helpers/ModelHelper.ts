import { Builder } from "flatbuffers";
import { Model } from "../.fbs/data.Model_generated";
import { TableHelper, TableData } from "./TableHelper";
import { JoinHelper, JoinData } from "./JoinHelper";

export type ModelData = {
  name: string;
  host: string;
  tables: TableData[];
  joins: JoinData[];
};

export class ModelHelper {
  private _table: TableHelper;
  private _join: JoinHelper;

  public constructor(private _builder: Builder) {
    this._table = new TableHelper(this._builder);
    this._join = new JoinHelper(this._builder);
  }

  public bufferizeModel(data: ModelData): number {
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

  public parseModel(model: Model): ModelData {
    return {
      name: model.name() || "",
      host: model.host() || "",
      tables: this._table.parseTables(model),
      joins: this._join.parseJoins(model),
    };
  }
}

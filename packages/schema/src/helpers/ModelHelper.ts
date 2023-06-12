/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Builder } from "flatbuffers";
import { Model } from "../.fbs/query.Model_generated";
import { TableHelper, TableDef } from "./TableHelper";
import { JoinHelper, JoinDef } from "./JoinHelper";

/**
 * An object for defining model.
 */
export type ModelDef = {
  name: string;
  tables: TableDef[];
  joins: JoinDef[];
};

/**
 * Model helper class.
 */
export class ModelHelper {
  private _table: TableHelper;
  private _join: JoinHelper;

  public constructor(private _builder: Builder) {
    this._table = new TableHelper(this._builder);
    this._join = new JoinHelper(this._builder);
  }

  public bufferizeModel(data: ModelDef): number {
    const name = this._builder.createString(data.name);
    const tables_ = this._table.bufferizeTables(data.tables);
    const tables = Model.createTablesVector(this._builder, tables_);
    const joins_ = this._join.bufferizeJoins(data.joins);
    const joins = Model.createJoinsVector(this._builder, joins_);
    Model.startModel(this._builder);
    Model.addName(this._builder, name);
    Model.addTables(this._builder, tables);
    Model.addJoins(this._builder, joins);
    return Model.endModel(this._builder);
  }

  public parseModel(model: Model): ModelDef {
    return {
      name: model.name() || "",
      tables: this._table.parseTables(model),
      joins: this._join.parseJoins(model),
    };
  }
}

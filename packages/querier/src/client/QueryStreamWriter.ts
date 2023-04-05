import * as arrow from "apache-arrow";
import { WriteStream } from "fs";
import { Client } from "./Client";
import { DataColumn, DataRow, State } from "./types.Response";

export class QueryStreamWriter extends arrow.RecordBatchWriter {
  private _client: null | Client = null;
  private _file: WriteStream;
  private _active = false;
  private _cancel = false;
  private _runned = false;
  private _s: arrow.Schema | null = null;

  /**
   * Class constructor.
   */
  constructor(statement: string, writeable: WriteStream) {
    super({
      autoDestroy: true,
      writeLegacyIpcFormat: false,
    });

    this._client = new Client({
      engine: "trino",
      source: "hdml-query-stream",
      checkInterval: 500,
    });
    this._file = writeable;

    this._run(statement).catch((reason) => {
      console.error(reason);
    });
  }

  private async _run(statement: string) {
    if (!this._active && this._client) {
      this._active = true;
      await this._client.execute(statement, {
        cancelFn: () => this._cancel,
        stateFn: this._stateHandler.bind(this),
        colsFn: this._colsHandler.bind(this),
        dataFn: this._dataHandler.bind(this),
      });
    }
  }

  private _stateHandler(state: State) {
    switch (state) {
      case "STARTING":
      case "QUEUED":
      case "PLANNING":
      case "RUNNING":
        console.log("state", state);
        break;
      case "FINISHED":
        console.log("state", state);
        // this.finish();
        break;
      case "FAILED":
      case "CANCELED":
        console.log("state", state);
        this.abort(state);
        break;
    }
  }

  private _colsHandler(cols: DataColumn[]) {
    if (!this._runned) {
      console.log("_colsHandler");
      this._runned = true;
      const fields: arrow.Field[] = [];
      cols.forEach((col) => {
        fields.push(
          new arrow.Field(col.name, this._getType(col), true),
        );
      });
      this._s = new arrow.Schema(fields);
      this.reset(this._file, new arrow.Schema(fields));
    }
  }

  private _getType(col: DataColumn): arrow.DataType {
    switch (col.type) {
      case "varchar":
        return new arrow.Utf8();
      case "bigint":
        return new arrow.Uint32();
      default:
        return new arrow.Utf8();
    }
  }

  private _dataHandler(data: DataRow[]) {
    if (this._runned) {
      console.log("_dataHandler");
      const builders: arrow.Builder[] = [];
      data.forEach((row) => {
        row.forEach((val, i) => {
          if (!builders[i]) {
            builders[i] = arrow.makeBuilder({
              type: <arrow.DataType>this._s?.fields[i].type,
              nullValues: [null, undefined],
            });
          }
          const builder = builders[i];
          builder.append(val);
        });
      });
      const cfg: { [field: string]: arrow.Vector } = {};
      builders.forEach((builder, i) => {
        builder.finish();
        const name = <string>this._s?.fields[i].name;
        const vector = builder.toVector();
        cfg[name] = vector;
      });
      const table = new arrow.Table(cfg);
      // this.write(table);
      table.batches.forEach((batch) => {
        console.log("batch", batch.toArray());
        this.write(batch);
      });
      this.finish();
    }
  }
}

import { Readable } from "stream";
import * as arrow from "apache-arrow";
import { Client } from "./Client";
import { DataColumn, DataRow, State } from "./types.Response";

export class QueryStream extends Readable {
  private _state: null | State = null;
  private _client: null | Client = null;
  private _active = false;
  private _cancel = false;
  private _schema: null | arrow.Schema = null;
  private _buff: DataRow[] = [];

  /**
   * Class constructor.
   */
  constructor(
    statement: string,
    options: {
      engine?: "presto" | "trino";
      host?: string;
      port?: number;
      user?: string;
      custom_auth?: string;
      basic_auth?: {
        user: string;
        password: string;
      };
      ssl?: object;
      catalog?: string;
      schema?: string;
      session?: string;
      prepares?: string[] | number[] | boolean[];
      timezone?: string;
      highWaterMark?: number;
    },
  ) {
    super({
      encoding: "utf8",
      objectMode: false,
      autoDestroy: true,
      highWaterMark: options.highWaterMark,
    });

    this._client = new Client({
      engine: options.engine || "trino",
      host: options.host,
      port: options.port,
      user: options.user,
      custom_auth: options.custom_auth,
      basic_auth: options.basic_auth,
      ssl: options.ssl,
      catalog: options.catalog,
      schema: options.schema,
      source: "hdml-query-stream",
      checkInterval: 500,
    });

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
      case "FINISHED":
      case "FAILED":
      case "CANCELED":
        this._state = state;
        this.emit(state);
        console.log("state", state);
        break;
    }
  }

  private _colsHandler(cols: DataColumn[]) {
    if (!this._schema) {
      const fields: arrow.Field[] = [];
      cols.forEach((col) => {
        fields.push(
          new arrow.Field(col.name, this._getType(col), true),
        );
      });
      this._schema = new arrow.Schema(fields);
      this.emit("schema", this._schema);
      // const table = new arrow.Table(this._schema);
      // const uint8 = arrow.tableToIPC(table);
      // const buff = Buffer.from(uint8.buffer);
      // this.push(buff.toString("base64"));
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
    if (this._schema) {
      const builders: arrow.Builder[] = [];
      data.forEach((row) => {
        row.forEach((val, i) => {
          if (!builders[i]) {
            builders[i] = arrow.makeBuilder({
              type: <arrow.DataType>this._schema?.fields[i].type,
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
        const name = <string>this._schema?.fields[i].name;
        const vector = builder.toVector();
        cfg[name] = vector;
      });
      const table = new arrow.Table(cfg);
      const uint8 = arrow.tableToIPC(table);
      const buff = Buffer.from(uint8.buffer);
      this.push(buff.toString("base64"));
      this.push(null);
    }
  }

  public _read(size: number): void {
    //
  }

  public _destroy(
    error: Error | null,
    callback: (error?: Error | null | undefined) => void,
  ): void {
    //
  }

  public cancel(): void {
    this._active = false;
    this._cancel = true;
  }
}

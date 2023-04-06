import * as arrow from "apache-arrow";
import { FlatClient } from "./client.FlatClient";
import {
  DataResponse,
  DataColumn,
  DataRow,
  State,
} from "./types.Response";

export class QueryAsyncIterable {
  private _client: null | FlatClient = null;
  private _promise: null | Promise<DataResponse> = null;
  private _next: null | string = null;
  private _schema: arrow.Schema | null = null;

  /**
   * Class constructor.
   */
  constructor(statement: string) {
    this._client = new FlatClient({
      engine: "trino",
      source: "hdml-query-async-iterable",
    });

    // arrow.RecordBatchFileWriter
    // arrow.RecordBatchStreamWriter

    this._promise = this._client.post(statement, {});
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<
    undefined | arrow.Table
  > {
    let res: DataResponse;
    if (this._promise) {
      res = await this._promise;
      this._next = <string>res.nextUri;
      this._promise = null;
    }
    while (this._next) {
      res = <DataResponse>await this._client?.fetch(this._next);
      this._next = res.nextUri || null;
      this._stateHandler(res.stats.state);
      if (!this._schema && res.columns) {
        this._schema = this._parseColumns(res.columns);
      }
      if (res.data) {
        yield this._parseData(res.data);
      }
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
        break;
      case "FAILED":
      case "CANCELED":
        console.log("state", state);
        break;
    }
  }

  private _parseColumns(cols: DataColumn[]) {
    const fields: arrow.Field[] = [];
    cols.forEach((col) => {
      fields.push(
        new arrow.Field(col.name, this._parseType(col), true),
      );
    });
    return new arrow.Schema(fields);
  }

  private _parseType(col: DataColumn): arrow.DataType {
    switch (col.type) {
      case "varchar":
        return new arrow.Utf8();
      case "bigint":
        return new arrow.Uint32();
      default:
        return new arrow.Utf8();
    }
  }

  private _parseData(data: DataRow[]) {
    // https://stackoverflow.com/questions/51409288/can-i-deserialize-
    // a-dictionary-of-dataframes-in-the-arrow-js-implementation
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

      const vectors: { [field: string]: arrow.Vector } = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const children: arrow.Data<any>[][] = [];
      builders.forEach((builder, i) => {
        builder.finish();
        const name = <string>this._schema?.fields[i].name;
        const vector = builder.toVector();
        vectors[name] = vector;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        children.push(vector.data);
      });

      const _data = arrow.makeData({
        type: new arrow.Struct(this._schema.fields),
        length: data.length,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        children,
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const batch = new arrow.RecordBatch(this._schema, _data);
      const table = new arrow.Table(vectors);
      return table;
    }
    return;
  }
}

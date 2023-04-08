/* eslint-disable @typescript-eslint/no-explicit-any */
import * as arrow from "apache-arrow";
import { FlatClient } from "./client.FlatClient";
import {
  DataResponse,
  DataColumn,
  DataRow,
  State,
} from "./types.Response";

export class AsyncIterableDataset
  implements AsyncIterable<arrow.RecordBatch>
{
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
    this._promise = this._client.post(statement, {});
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<arrow.RecordBatch> {
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
        const batch = this._parseBatch(res.data);
        // if (batch) {
        //   yield batch;
        // }
        // Test for multiple batch processing.
        for (let i = 0; i < res.data.length; i++) {
          const batch = this._parseBatch([res.data[i]]);
          if (batch) {
            yield batch;
          }
        }
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

  private _parseTable(data: DataRow[]) {
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
      builders.forEach((builder, i) => {
        builder.finish();
        const name = <string>this._schema?.fields[i].name;
        const vector = builder.toVector();
        vectors[name] = vector;
      });
      const table = new arrow.Table(vectors);
      return table;
    }
    return;
  }

  private _parseBatch(data: DataRow[]) {
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

      const vectors: {
        [field: string]: arrow.Data<arrow.DataType<arrow.Type, any>>;
      } = {};
      builders.forEach((builder, i) => {
        builder.finish();
        const name = <string>this._schema?.fields[i].name;
        const vector = builder.toVector();
        vectors[name] = <arrow.Data<arrow.DataType<arrow.Type, any>>>(
          (<unknown>vector)
        );
      });
      return new arrow.RecordBatch(vectors);
    }
    return;
  }
}

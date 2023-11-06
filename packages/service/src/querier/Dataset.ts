/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  RecordBatch,
  RecordBatchStreamWriter,
  makeBuilder,
  Builder,
  Schema,
  Field,
  Data,
  Type,
  DataType,
  Utf8,
  Uint32,
} from "apache-arrow";
import { QueryBuf, QueryState } from "@hdml/schema";
import { getSQL } from "@hdml/orchestrator";
import { Client, DataResponse, DataColumn, DataRow } from "./Client";

/**
 * Fragment of the response to the published query.
 */
export type Chunk = {
  state: QueryState;
  warning?: string;
  error?: string;
  data?: Uint8Array;
};

/**
 * An asynchronous iterator that returns chunks of data from a
 * published query.
 */
export class Dataset implements AsyncIterable<Chunk> {
  private _client: null | Client = null;
  private _state: QueryState = QueryState.PROCESSING;
  private _promise: null | Promise<DataResponse> = null;
  private _next: null | string = null;
  private _schema: null | Schema = null;
  private _error: null | Error = null;

  /**
   * Class constructor.
   */
  public constructor(
    query: QueryBuf,
    conf: { host: string; port: number },
  ) {
    try {
      this._client = new Client({
        engine: "trino",
        host: conf.host,
        port: conf.port,
        catalog: undefined,
        schema: undefined,
        user: "hdml",
        source: "Dataset",
      });
      this._promise = this._client.post(getSQL(query), {});
    } catch (error) {
      this._state = QueryState.FAIL;
      this._error = <Error>error;
    }
  }

  /**
   * Async iterator.
   */
  public async *[Symbol.asyncIterator](): AsyncGenerator<Chunk> {
    let res: DataResponse;
    if (this._error) {
      const error =
        `Type: "n/a"\n` +
        `Name: "n/a"\n` +
        `Code: "n/a"\n` +
        `Message: ${this._error.message || "n/a"}`;
      yield { state: this._state, error };
    } else {
      if (this._promise) {
        res = await this._promise;
        const [next, state] = this.responseHandler(res);
        this._promise = null;
        this._next = next;
        this._state = state;
        yield { state: this._state };
      }
      while (this._client && this._next) {
        res = await this._client.fetch(this._next);
        const [next, state, schema, chunk] =
          this.responseHandler(res);
        this._next = next;
        this._state = state;
        if (!this._schema && schema) {
          this._state = QueryState.SCHEMA;
          this._schema = schema;
          yield {
            state: this._state,
            data: this.parseSchemaChunk(this._schema),
          };
        }
        if (chunk) {
          this._state = QueryState.CHUNK;
          yield {
            state: this._state,
            data: chunk,
          };
        }
        if (state === QueryState.DONE) {
          this._state = state;
          yield { state: this._state };
        }
        if (state === QueryState.FAIL) {
          this._state = state;
          const error =
            `Type: ${res.error?.errorType || "n/a"}\n` +
            `Name: ${res.error?.errorName || "n/a"}\n` +
            `Code: ${res.error?.errorCode || "n/a"}\n` +
            `Message: ${res.error?.message || "n/a"}`;
          yield { state: this._state, error };
        }
      }
    }
  }

  private responseHandler(
    res: DataResponse,
  ): [string | null, QueryState, Schema | null, Uint8Array | null] {
    const next = res.nextUri || null;
    const state = this.parseState(res);
    const schema = this.parseSchema(res.columns);
    const chunk = this.parseDataChunk(schema, res.data);
    return [next, state, schema, chunk];
  }

  private parseState(res: DataResponse): QueryState {
    switch (res.stats.state) {
      default:
      case "QUEUED":
      case "PLANNING":
      case "STARTING":
      case "RUNNING":
        return QueryState.PROCESSING;
      case "FINISHED":
      case "CANCELED":
        return QueryState.DONE;
      case "FAILED":
        return QueryState.FAIL;
    }
  }

  private parseSchema(cols?: DataColumn[]): null | Schema {
    if (!cols) {
      return null;
    } else {
      const fields: Field[] = [];
      cols.forEach((col) => {
        fields.push(new Field(col.name, this.parseType(col), true));
      });
      return new Schema(fields);
    }
  }

  private parseType(col: DataColumn): DataType {
    switch (col.type) {
      case "varchar":
        return new Utf8();
      case "integer":
        return new Uint32();
      case "bigint":
        return new Uint32();
      default:
        return new Utf8();
    }
  }

  private parseSchemaChunk(schema: Schema): Uint8Array {
    const writer = new RecordBatchStreamWriter();
    const builders: Builder[] = [];
    const vectors: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [field: string]: Data<DataType<Type, any>>;
    } = {};
    schema.fields.forEach((field) => {
      builders.push(
        makeBuilder({
          type: <DataType>field.type,
          nullValues: [null, undefined],
        }),
      );
    });
    builders.forEach((builder, i) => {
      builder.finish();
      const name = schema.fields[i].name;
      const vector = builder.toVector();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vectors[name] = <Data<DataType<Type, any>>>(<unknown>vector);
    });
    writer.write(new RecordBatch(vectors));
    return writer.toUint8Array(true);
  }

  private parseDataChunk(
    schema: null | Schema,
    data?: DataRow[],
  ): null | Uint8Array {
    if (!schema || !data) {
      return null;
    } else {
      const writer = new RecordBatchStreamWriter();
      const builders: Builder[] = [];
      const vectors: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [field: string]: Data<DataType<Type, any>>;
      } = {};

      data.forEach((row) => {
        row.forEach((val, i) => {
          if (!builders[i]) {
            builders[i] = makeBuilder({
              type: <DataType>schema.fields[i].type,
              nullValues: [null, undefined],
            });
          }
          const builder = builders[i];
          builder.append(val);
        });
      });
      builders.forEach((builder, i) => {
        builder.finish();
        const name = schema.fields[i].name;
        const vector = builder.toVector();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vectors[name] = <Data<DataType<Type, any>>>(<unknown>vector);
      });
      writer.write(new RecordBatch(vectors));
      return writer.toUint8Array(true);
    }
  }
}

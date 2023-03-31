import { post, get, NeedleResponse } from "needle";
import { Injectable } from "@nestjs/common";
import { Column, Row, TrinoResponse } from "./types/TrinoResponse";

@Injectable()
export class QueryV1Service {
  public async execute(statement: string): Promise<void> {
    let columns: Array<Column> = [];
    let data: Array<Row> = [];
    let res = await this.postStatement(statement);
    while (res.nextUri) {
      res = await this.fetchNext(res.nextUri);
      if (columns.length === 0 && res.columns) {
        columns = columns.concat(res.columns);
      }
      if (res.data) {
        data = data.concat(res.data);
      }
    }
    console.log("Columns:", columns);
    console.log("Data:", data);
  }

  /**
   * Posts SQL statement to the Trino server and returns Trino's
   * response.
   */
  public async postStatement(
    statement: string,
  ): Promise<TrinoResponse> {
    return new Promise((resolve, reject) => {
      post(
        "http://localhost:8080/v1/statement",
        statement,
        {
          headers: { "X-Trino-User": "hdml" },
        },
        (err: null | Error, res: NeedleResponse) => {
          if (err) {
            reject(err);
          } else {
            resolve(<TrinoResponse>res.body);
          }
        },
      );
    });
  }

  /**
   * Fetches the next chunk of requested data from the Trino server.
   */
  public async fetchNext(nextUri: string): Promise<TrinoResponse> {
    return new Promise((resolve, reject) => {
      get(nextUri, (err: null | Error, res: NeedleResponse) => {
        if (err) {
          reject(err);
        } else {
          resolve(<TrinoResponse>res.body);
        }
      });
    });
  }
}

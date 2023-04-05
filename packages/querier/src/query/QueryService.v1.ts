import { createWriteStream } from "fs";
import { Injectable } from "@nestjs/common";
import * as arrow from "apache-arrow";
// import { QueryStream } from "../client/QueryStream";
import { QueryStreamWriter } from "../client/QueryStreamWriter";

@Injectable()
export class QueryV1Service {
  public async execute(statement: string): Promise<void> {
    // return new Promise((resolve) => {
    //   const query = new QueryStream(statement, {});
    //   query.on("schema", (schema: arrow.Schema) => {
    //     console.log(schema);
    //   });
    //   query.on("data", (data: string) => {
    //     const buff = Buffer.from(data, "base64");
    //     const uin8 = new Uint8Array(buff);
    //     const table = arrow.tableFromIPC(uin8);
    //     console.log(table.toString());
    //   });
    //   query.on("end", () => {
    //     resolve(undefined);
    //   });
    // });
    return new Promise((resolve) => {
      new QueryStreamWriter(
        statement,
        createWriteStream("query.arrow"),
      );
      setTimeout(resolve, 5000);
    });
  }
}

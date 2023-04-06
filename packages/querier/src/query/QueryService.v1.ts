import * as arrow from "apache-arrow";
import * as fs from "fs";
import { Injectable } from "@nestjs/common";
import { QueryAsyncIterable } from "../client/QueryAsyncIterable";

@Injectable()
export class QueryV1Service {
  public async execute(statement: string): Promise<void> {
    const writer = new arrow.RecordBatchFileWriter();
    const filer = fs.createWriteStream("query.arrow");
    writer.pipe(filer);

    const iterable = new QueryAsyncIterable(statement);
    for await (const chunk of iterable) {
      writer.write(chunk);
    }
  }
}

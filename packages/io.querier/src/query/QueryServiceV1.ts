import * as fs from "fs";
import * as stream from "stream";
import * as arrow from "apache-arrow";
import { Injectable, StreamableFile } from "@nestjs/common";
import { AsyncIterableDataset } from "../client/AsyncIterableDataset";

@Injectable()
export class QueryServiceV1 {
  /**
   * Executes SQL statement, saves resultset to a file.
   * @param statement SQL statement
   */
  public async executeFile(statement: string): Promise<void> {
    // Run query, write dataset to a file:
    const dataset = new AsyncIterableDataset(statement);
    const datasetWriter = new arrow.RecordBatchFileWriter();
    datasetWriter.pipe(fs.createWriteStream("query.arrow"));
    await datasetWriter.writeAll(dataset);

    // Read dataset from a file to a table:
    const datasetReader = await (<
      Promise<arrow.AsyncRecordBatchFileReader>
    >(<unknown>(
      arrow.RecordBatchFileReader.from(
        fs.createReadStream("query.arrow"),
      )
    )));
    const table = new arrow.Table(datasetReader);

    // Logging table:
    console.log(table.schema, table.toString());
  }

  /**
   * Executes SQL statement, saves full resultset to a stream.
   * @param statement SQL statement
   */
  public async executeTable(statement: string): Promise<void> {
    // Run query, write dataset to a writer:
    const dataset = new AsyncIterableDataset(statement);
    const datasetWriter = new arrow.RecordBatchStreamWriter();
    await datasetWriter.writeAll(dataset);

    // Write dataseet to a stream:
    const datasetStream = new stream.PassThrough();
    datasetStream.end(await datasetWriter.toUint8Array());

    // Read dataset from a stream to a table:
    const table = arrow.tableFromIPC(
      Uint8Array.from(<Buffer>datasetStream.read()),
    );

    // Logging table:
    console.log(table.schema, table.toString());
  }

  /**
   * Executes SQL statement, saves resultset to a stream chunk by
   * chunk.
   * @param statement SQL statement
   */
  public async executeChunk(statement: string): Promise<string> {
    // Run query, prepare stream:
    const dataset = new AsyncIterableDataset(statement);
    const datasetStream = new stream.PassThrough();

    // Write every chunk to the stream:
    for await (const batch of dataset) {
      const datasetWriter = new arrow.RecordBatchStreamWriter();
      datasetWriter.write(batch);
      datasetStream.write(datasetWriter.toUint8Array(true));
    }
    datasetStream.end();

    // Read dataset from a stream to a table:
    const table = arrow.tableFromIPC(
      Uint8Array.from(<Buffer>datasetStream.read()),
    );

    // Logging table:
    console.log(table.schema, table.toString());

    return table.toString();
  }

  /**
   * Executes SQL statement, saves resultset to a stream chunk by
   * chunk.
   * @param statement SQL statement
   */
  public async executeBin(
    statement: string,
  ): Promise<StreamableFile> {
    const dataset = new AsyncIterableDataset(statement);
    const datasetWriter = new arrow.RecordBatchStreamWriter();
    const stream = datasetWriter.toNodeStream();
    await datasetWriter.writeAll(dataset);
    return new StreamableFile(stream);
  }
}

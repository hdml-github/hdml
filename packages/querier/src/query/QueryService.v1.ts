import { Injectable } from "@nestjs/common";
import { Client } from "../client/Client";

@Injectable()
export class QueryV1Service {
  public async execute(statement: string): Promise<void> {
    const client = new Client({
      engine: "trino",
      user: "hdml",
    });
    const done = await client.execute(statement, {
      cancelFn: () => false,
      stateFn: (state) => {
        console.log("state", state);
      },
      colsFn: (cols) => {
        console.log("cols", cols);
      },
      dataFn: (data) => {
        console.log("data", data);
      },
    });
    console.log("done", done);
  }
}

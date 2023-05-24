import * as stream from "stream";
import * as rawbody from "raw-body";
import {
  Controller,
  Header,
  Get,
  Post,
  Req,
  StreamableFile,
} from "@nestjs/common";
import { Request } from "express";
import { Document } from "@hdml/schema";
import { orchestrate } from "@hdml/orchestrator";
import { GatewayQueue } from "./GatewayQueue";

@Controller("api/v0")
export class GatewayRestApiV0 {
  constructor(private readonly _queue: GatewayQueue) {}

  @Get("test")
  @Header("Access-Control-Allow-Origin", "*")
  async test(@Req() req: Request): Promise<string> {
    return await this._queue.test();
  }

  @Post()
  @Header("Access-Control-Allow-Origin", "*")
  async statement(@Req() req: Request): Promise<StreamableFile> {
    if (req.readable) {
      const buff = await rawbody(req);
      const doc = new Document(buff);
      const sql = orchestrate(doc);
      console.log(sql);
      const response = await fetch("http://localhost:3000", {
        method: "POST",
        mode: "cors",
        redirect: "follow",
        cache: "no-cache",
        headers: {
          Accept: "text/html; charset=utf-8",
          "Content-Type": "text/html; charset=utf-8",
        },
        body: sql,
      });
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      const buffer = await response.arrayBuffer();
      const array = new Uint8Array(buffer);
      const datasetStream = new stream.PassThrough();
      datasetStream.write(array);
      datasetStream.end();
      return new StreamableFile(datasetStream);
    } else {
      throw new Error("Can't parse the request body.");
    }
  }
}

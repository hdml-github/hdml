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
import { IoServiceV0 } from "./IoServiceV0";

@Controller()
export class IoController {
  constructor(private readonly queryService: IoServiceV0) {}

  @Get()
  @Header("Access-Control-Allow-Origin", "*")
  test(@Req() req: Request): string {
    return JSON.stringify("Get World!");
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

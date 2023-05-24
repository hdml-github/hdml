import * as stream from "stream";
import * as rawbody from "raw-body";
import {
  Controller,
  Header,
  Get,
  Post,
  Param,
  Req,
  StreamableFile,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request } from "express";
import { Document } from "@hdml/schema";
import { orchestrate } from "@hdml/orchestrator";
import { BaseLogger } from "@hdml/io.common";
import { QueueSvc } from "./QueueSvc";

/**
 * Public REST API controller.
 */
@Controller({ path: ":tenant/api/v0" })
export class PublicRestCtrl {
  /**
   * Service logger.
   */
  private readonly _logger = new BaseLogger(PublicRestCtrl.name, {
    timestamp: true,
  });

  /**
   * Class constructor.
   */
  constructor(private readonly _queue: QueueSvc) {}

  /**
   * The `POST /hdml` endpoint handler.
   */
  @Post("hdml")
  @Header("Access-Control-Allow-Origin", "*")
  public async postHdml(
    @Param("tenant") tenant: string,
    @Req() request: Request,
  ): Promise<string> {
    if (!request.readable) {
      throw new HttpException(
        "Bad request (non-readable)",
        HttpStatus.BAD_REQUEST,
      );
    }
    const token = request.header("Token");
    const buffer = await rawbody(request);
    const document = new Document(buffer);
    let name = "";
    if (document.frame) {
      name = `hdml-frame=${document.frame.name}`;
    } else if (document.model) {
      name = `hdml-model=${document.model.name}`;
    } else {
      throw new HttpException(
        "Bad request (empty document)",
        HttpStatus.BAD_REQUEST,
      );
    }
    this._logger.debug("Posting document", {
      tenant,
      token,
      name,
    });
    return Promise.resolve("");
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

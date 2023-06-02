import * as rawbody from "raw-body";
import {
  Controller,
  Header,
  Get,
  Post,
  Param,
  Query,
  Req,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request } from "express";
import { Document } from "@hdml/schema";
import { BaseLogger } from "@hdml/io.common";
import { Filer } from "../services/Filer";
import { Tokens } from "../services/Tokens";
import { Options } from "../services/Options";

/**
 * Public REST API controller.
 */
@Controller({ path: ":tenant/api/v0" })
export class PublicREST {
  /**
   * Service logger.
   */
  private readonly _logger = new BaseLogger(PublicREST.name, {
    timestamp: true,
  });

  /**
   * Class constructor.
   */
  constructor(
    private readonly _filer: Filer,
    private readonly _tokens: Tokens,
    private readonly _options: Options,
  ) {}

  /**
   * The `GET /session?token=:token` endpopint handler.
   */
  @Get("session")
  @Header("Access-Control-Allow-Origin", "*")
  public async getSession(
    @Param("tenant")
    tenant: string,
    @Query("token")
    token?: string,
  ): Promise<string> {
    this._logger.debug("Session requested", {
      tenant,
      token,
    });
    try {
      return this._tokens.getSessionToken(
        this._filer.getPublicKey(tenant),
        this._filer.getPrivateKey(tenant),
        token,
      );
    } catch (error) {
      this._logger.error(error);
      throw error;
    }
  }

  /**
   * The `POST /hdml` endpoint handler.
   */
  @Post("hdml")
  @Header("Access-Control-Allow-Origin", "*")
  public async postHdml(
    @Param("tenant") tenant: string,
    @Req() request: Request,
  ): Promise<string> {
    this._logger.debug("Document posted", {
      tenant,
      session: request.header("Session"),
    });
    try {
      if (!request.readable) {
        throw new HttpException(
          "Bad request (non-readable)",
          HttpStatus.BAD_REQUEST,
        );
      }
      const body = await rawbody(request);
      const context = await this._tokens.getContext(
        this._filer.getPrivateKey(tenant),
        request.header("Session"),
      );
      const name = await this._filer.postHdmlDocument(
        tenant,
        context,
        new Document(body),
      );
      return name;
    } catch (error) {
      this._logger.error(error);
      throw error;
    }
  }

  // @Post()
  // @Header("Access-Control-Allow-Origin", "*")
  // async statement(@Req() req: Request): Promise<StreamableFile> {
  //   if (req.readable) {
  //     const buff = await rawbody(req);
  //     const doc = new Document(buff);
  //     const sql = orchestrate(doc);
  //     console.log(sql);
  //     const response = await fetch("http://localhost:3000", {
  //       method: "POST",
  //       mode: "cors",
  //       redirect: "follow",
  //       cache: "no-cache",
  //       headers: {
  //         Accept: "text/html; charset=utf-8",
  //         "Content-Type": "text/html; charset=utf-8",
  //       },
  //       body: sql,
  //     });
  //     if (!response.ok) {
  //       throw new Error("Network response was not OK");
  //     }
  //     const buffer = await response.arrayBuffer();
  //     const array = new Uint8Array(buffer);
  //     const datasetStream = new stream.PassThrough();
  //     datasetStream.write(array);
  //     datasetStream.end();
  //     return new StreamableFile(datasetStream);
  //   } else {
  //     throw new Error("Can't parse the request body.");
  //   }
  // }
}

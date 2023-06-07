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
  StreamableFile,
} from "@nestjs/common";
import { Request } from "express";
import { Query as HdmlQuery } from "@hdml/schema";
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
   * `GET /session?token=:token` endpopint handler.
   */
  @Get("session")
  @Header("Access-Control-Allow-Origin", "*")
  public async getSession(
    @Param("tenant")
    tenant: string,
    @Query("token")
    token?: string,
  ): Promise<string> {
    this._logger.debug("Session requested");
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
   * `POST /hdml` endpoint handler.
   */
  @Post("hdml")
  @Header("Access-Control-Allow-Origin", "*")
  public async postHdml(
    @Param("tenant")
    tenant: string,
    @Req()
    request: Request,
  ): Promise<StreamableFile> {
    this._logger.debug("Query posted");
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
      return await this._filer.postHdmlDocument(
        tenant,
        context,
        new HdmlQuery(body),
      );
    } catch (error) {
      this._logger.error(error);
      throw error;
    }
  }

  /**
   * `GET /hdml/:document` endpoint handler.
   */
  @Get("hdml/:document")
  @Header("Access-Control-Allow-Origin", "*")
  public async getHdml(
    @Param("tenant")
    tenant: string,
    @Param("document")
    document: string,
    @Req()
    request: Request,
  ): Promise<StreamableFile> {
    this._logger.debug("Document requested");
    try {
      await this._tokens.getContext(
        this._filer.getPrivateKey(tenant),
        request.header("Session"),
      );
      return await this._filer.getHdmlDocumentFile(document);
    } catch (error) {
      this._logger.error(error);
      throw error;
    }
  }
}

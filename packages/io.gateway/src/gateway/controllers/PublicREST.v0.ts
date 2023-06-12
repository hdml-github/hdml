/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

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
import { Tenants } from "../services/Tenants";
import { Tokens } from "../services/Tokens";
import { Queries } from "../services/Queries";

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
    private readonly _tenants: Tenants,
    private readonly _tokens: Tokens,
    private readonly _queries: Queries,
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
        this._tenants.getPublicKey(tenant),
        this._tenants.getPrivateKey(tenant),
        token,
      );
    } catch (error) {
      this._logger.error(error);
      throw error;
    }
  }

  /**
   * `POST /query` endpoint handler.
   */
  @Post("query")
  @Header("Access-Control-Allow-Origin", "*")
  public async postQuery(
    @Param("tenant")
    tenant: string,
    @Req()
    request: Request,
  ): Promise<StreamableFile> {
    this._logger.debug("Query posted");
    try {
      if (!request.readable) {
        throw new HttpException(
          "Not readable request",
          HttpStatus.BAD_REQUEST,
        );
      }
      const query = await rawbody(request);
      const context = await this._tokens.getContext(
        this._tenants.getPrivateKey(tenant),
        request.header("Session"),
      );
      const file = this._tenants.getTenantFile(tenant);
      if (!file) {
        throw new HttpException(
          "Tenant file is missed",
          HttpStatus.BAD_REQUEST,
        );
      } else {
        return await this._queries.postQuery(
          tenant,
          file,
          context,
          new HdmlQuery(query),
        );
      }
    } catch (error) {
      this._logger.error(error);
      throw error;
    }
  }

  /**
   * `GET /query/:file` endpoint handler.
   */
  @Get("query/:file")
  @Header("Access-Control-Allow-Origin", "*")
  public async getHdml(
    @Param("tenant")
    tenant: string,
    @Param("file")
    file: string,
    @Req()
    request: Request,
  ): Promise<StreamableFile> {
    this._logger.debug("Query result file requested");
    try {
      await this._tokens.getContext(
        this._tenants.getPrivateKey(tenant),
        request.header("Session"),
      );
      return await this._queries.getResultFileStream(file);
    } catch (error) {
      this._logger.error(error);
      throw error;
    }
  }
}

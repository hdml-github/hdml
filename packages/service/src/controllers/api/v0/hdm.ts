/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { getHTML, getSQL } from "@hdml/orchestrator";
import { QueryDef, QueryBuf } from "@hdml/schema";
import {
  Controller,
  UseGuards,
  Get,
  Post,
  Request,
  Query,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { Auth } from "../../../guards/Auth";
import { Logger } from "../../../services/Logger";
import { Tenants } from "../../../services/Tenants";
import { Threads } from "../../../services/Threads";

/**
 * The `api/v0/hdml` path controller.
 */
@Controller({ path: "api/v0/hdm" })
@UseGuards(Auth)
export class hdm {
  private _logger: Logger;

  /**
   * @constructor
   */
  constructor(private _tenants: Tenants, private _threads: Threads) {
    this._logger = new Logger("api/v0/hdm", this._threads);
  }

  /**
   * The `GET /uris?tenant=:tenant` endpoint.
   */
  @Get("uris")
  public getUris(
    @Query("tenant")
    tenant: string,
  ): string[] {
    try {
      return this._tenants.getUris(tenant);
    } catch (err) {
      this._logger.error(err);
      throw err;
    }
  }

  /**
   * The `GET /def?tenant=:tenant&uri=:uri` endpoint.
   */
  @Get("def")
  public async getDef(
    @Query("tenant")
    tenant: string,
    @Query("uri")
    uri: string,
  ): Promise<QueryDef> {
    try {
      return await this._tenants.getQueryDef(tenant, uri);
    } catch (err) {
      this._logger.error(err);
      throw err;
    }
  }

  /**
   * The `GET /htm?tenant=:tenant&uri=:uri` endpoint.
   */
  @Get("htm")
  public async getHtm(
    @Query("tenant")
    tenant: string,
    @Query("uri")
    uri: string,
  ): Promise<string> {
    try {
      return getHTML(await this._tenants.getQueryDef(tenant, uri));
    } catch (err) {
      this._logger.error(err);
      throw err;
    }
  }

  /**
   * The `GET /sql?tenant=:tenant&uri=:uri` endpoint.
   */
  @Get("sql")
  public async getSql(
    @Query("tenant")
    tenant: string,
    @Query("uri")
    uri: string,
  ): Promise<string> {
    try {
      return getSQL(await this._tenants.getQueryDef(tenant, uri));
    } catch (err) {
      this._logger.error(err);
      throw err;
    }
  }

  /**
   * The `POST /fragments?tenant=:tenant` endpoint.
   */
  @Post("fragments")
  public async postFragment(
    @Query("tenant")
    tenant: string,
    @Request()
    request: FastifyRequest,
  ): Promise<string> {
    this._logger.log(
      JSON.stringify(
        new QueryBuf(<Buffer>request.body),
        undefined,
        2,
      ),
    );
    return Promise.resolve(tenant);
  }
}

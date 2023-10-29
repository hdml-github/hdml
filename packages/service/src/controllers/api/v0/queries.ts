/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

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
import { Thread } from "../../../services/Thread";

/**
 * The `api/v0/queries` path controller.
 */
@Controller({ path: "api/v0/queries" })
@UseGuards(Auth)
export class queries {
  private _logger: Logger;

  /**
   * @constructor
   */
  constructor(private _tenants: Tenants, private _thread: Thread) {
    this._logger = new Logger("api/v0/queries", this._thread);
  }

  /**
   * The `GET /definititions?tenant=:tenant&uri=:uri` endpoint.
   */
  @Get("definititions")
  public async getDefinitions(
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

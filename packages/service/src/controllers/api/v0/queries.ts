/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { QueryDef } from "@hdml/schema";
import {
  Controller,
  UseGuards,
  Get,
  Post,
  Query,
} from "@nestjs/common";
import { Auth } from "../../../guards/Auth";
import { Logger } from "../../../services/Logger";
import { Tenants } from "../../../services/Tenants";
import { Tokens } from "../../../services/Tokens";
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
  constructor(
    private _tenants: Tenants,
    private _tokens: Tokens,
    private _thread: Thread,
  ) {
    this._logger = new Logger("/queries", this._thread);
  }

  /**
   * The `GET /definititions?tenant=:tenant` endpoint.
   */
  @Get("definititions")
  public getRoot(
    @Query("tenant")
    tenant: string,
    @Query("uri")
    uri?: string,
  ): Record<string, QueryDef> {
    // this._logger.log(this._thread.getScope());
    return this._tenants.getQueriesDefinitions(tenant, uri);
  }

  /**
   * The `POST /fragment?tenant=:tenant` endpoint.
   */
  @Post("fragment")
  public async postFragment(
    @Query("tenant")
    tenant: string,
  ): Promise<string> {
    return Promise.resolve(tenant);
  }
}

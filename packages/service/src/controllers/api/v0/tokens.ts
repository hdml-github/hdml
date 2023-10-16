/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Controller, Get, Query } from "@nestjs/common";
import { Tokens } from "../../../services/Tokens";
import { Workdir } from "../../../services/Workdir";

/**
 * The `api/v0/tokens` endpoint controller.
 */
@Controller({ path: "api/v0/tokens" })
export class tokens {
  /**
   * @constructor
   */
  constructor(
    private readonly _tokens: Tokens,
    private readonly _workdir: Workdir,
  ) {}

  /**
   * `GET /?tenant=:tenant&scope=:scope&ttl=:ttl`
   */
  @Get()
  public async getTokens(
    @Query("tenant")
    tenant: string,
    @Query("ttl")
    ttl?: string,
    @Query("scope")
    scope?: string,
  ): Promise<string> {
    return this._tokens.getAccessToken(
      await this._tokens.getPublicKey(
        await this._workdir.loadPub(tenant),
      ),
      ttl,
      scope,
    );
  }
}

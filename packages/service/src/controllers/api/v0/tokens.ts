/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Controller, Get, Query } from "@nestjs/common";
import { Tenants } from "../../../services/Tenants";
import { Tokens } from "../../../services/Tokens";

/**
 * The `api/v0/tokens` endpoint controller.
 */
@Controller({ path: "api/v0/tokens" })
export class tokens {
  /**
   * @constructor
   */
  constructor(
    private readonly _tenants: Tenants,
    private readonly _tokens: Tokens,
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
      await this._tenants.getPublicKey(tenant),
      ttl,
      scope,
    );
  }
}

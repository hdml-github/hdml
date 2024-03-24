/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Controller, Get, Query } from "@nestjs/common";
import { Tenants } from "../../../services/Tenants";
import { Tokens } from "../../../services/Tokens";

/**
 * The `api/v0/sessions` endpoint controller.
 */
@Controller({ path: "api/v0/sessions" })
export class sessions {
  /**
   * @constructor
   */
  constructor(
    private readonly _tenants: Tenants,
    private readonly _tokens: Tokens,
  ) {}

  /**
   * `GET /?tenant=:tenant&token=:token`
   */
  @Get()
  public async getSession(
    @Query("tenant")
    tenant: string,
    @Query("token")
    token?: string,
  ): Promise<string> {
    return this._tokens.getSessionToken(
      await this._tenants.getPublicKey(tenant),
      await this._tenants.getPrivateKey(tenant),
      token,
    );
  }
}

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Controller, Get, Param, Query } from "@nestjs/common";
import { BaseLogger } from "@hdml/io.common";
import { Tenants } from "../services/Tenants";
import { Tokens } from "../services/Tokens";

/**
 * Private REST API controller.
 */
@Controller({ path: ":tenant/api/v0" })
export class PrivateREST {
  /**
   * Service logger.
   */
  private readonly _logger = new BaseLogger(PrivateREST.name, {
    timestamp: true,
  });

  /**
   * Class constructor.
   */
  constructor(
    private readonly _tokens: Tokens,
    private readonly _tenants: Tenants,
  ) {}

  /**
   * The `GET /token?scope=:scope` endpoint handler.
   */
  @Get("token")
  public async postHdml(
    @Param("tenant")
    tenant: string,
    @Query("ttl")
    ttl?: string,
    @Query("scope")
    scope?: string,
  ): Promise<string> {
    this._logger.debug("Access token requested", {
      tenant,
      ttl,
      scope,
    });
    try {
      return this._tokens.getAccessToken(
        this._tenants.getPublicKey(tenant),
        ttl,
        scope,
      );
    } catch (error) {
      this._logger.error(error);
      throw error;
    }
  }
}

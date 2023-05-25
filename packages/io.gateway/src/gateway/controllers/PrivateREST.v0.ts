import {
  Controller,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { BaseLogger } from "@hdml/io.common";
import { Filer } from "../services/Filer";
import { Tokens } from "../services/Tokens";
import { Options } from "../services/Options";

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
    private readonly _filer: Filer,
    private readonly _tokens: Tokens,
    private readonly _options: Options,
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
        this._filer.getPublicKey(tenant),
        ttl,
        scope,
      );
    } catch (error) {
      this._logger.error(error);
      throw error;
    }
  }
}

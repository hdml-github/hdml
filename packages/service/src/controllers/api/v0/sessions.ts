/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Controller, Get, Query } from "@nestjs/common";
import { Tokens } from "../../../services/Tokens";
import { Workdir } from "../../../services/Workdir";

/**
 * The `api/v0/sessions` endpoint controller.
 */
@Controller({ path: "api/v0/sessions" })
export class sessions {
  /**
   * @constructor
   */
  constructor(
    private readonly _tokens: Tokens,
    private readonly _workdir: Workdir,
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
      await this._tokens.getPublicKey(
        await this._workdir.loadPub(tenant),
      ),
      await this._tokens.getPrivateKey(
        await this._workdir.loadKey(tenant),
      ),
      token,
    );
  }
}

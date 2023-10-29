/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { Config } from "../services/Config";
import { Logger } from "../services/Logger";
import { Tenants } from "../services/Tenants";
import { Thread } from "../services/Thread";
import { Tokens } from "../services/Tokens";

/**
 * Authorization guard class.
 */
@Injectable()
export class Auth implements CanActivate {
  private _logger: Logger;
  /**
   * @constructor
   */
  constructor(
    private _config: Config,
    private _thread: Thread,
    private _tenants: Tenants,
    private _tokens: Tokens,
  ) {
    this._logger = new Logger("Auth", this._thread);
  }

  /**
   * Returns value indicating whether or not the current request is
   * allowed to proceed.
   *
   * @implements
   */
  public async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const tname = this._config.authTenantParam;
    const sname = this._config.authSessionHeader;
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const tenant = !req.query
      ? undefined
      : !(<Record<string, string>>req.query)[tname]
      ? undefined
      : (<Record<string, string>>req.query)[tname];
    const token = !req.headers[sname]
      ? undefined
      : Array.isArray(req.headers[sname])
      ? (<string[]>req.headers[sname])[0]
      : <string>req.headers[sname];
    if (!tenant || !token) {
      this._logger.error(
        `The request header "${sname}" and the parameter "${tname}"` +
          " are required",
      );
      return false;
    } else {
      const key = await this._tenants.getPrivateKey(tenant);
      try {
        return this._thread.setScope(
          await this._tokens.getContext(key, token),
        );
      } catch (e) {
        this._logger.error(e);
        return false;
      }
    }
  }
}

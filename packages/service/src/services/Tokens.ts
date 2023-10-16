/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  importSPKI,
  importPKCS8,
  KeyLike,
  CompactEncrypt,
  jwtDecrypt,
  JWTPayload,
} from "jose";
import {
  Injectable,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Config } from "./Config";

/**
 * Tokens service.
 */
@Injectable()
export class Tokens {
  /**
   * Class constructor.
   */
  constructor(private readonly _conf: Config) {}

  /**
   * Returns a `KeyLike` object for the private key `content`.
   */
  public async getPrivateKey(content: string): Promise<KeyLike> {
    return await importPKCS8(content, this._conf.jweImp);
  }

  /**
   * Returns a `KeyLike` object for the public key `content`.
   */
  public async getPublicKey(content: string): Promise<KeyLike> {
    return await importSPKI(content, this._conf.jweImp);
  }

  /**
   * Returns a token with the provided `sub`, `ttl` (in sec) and
   * `scope`.
   */
  public async stringlify(
    pub: KeyLike,
    sub: string,
    ttl: number,
    scope: object,
  ): Promise<string> {
    const payload = Buffer.from(
      JSON.stringify({
        // with the following scope
        ...scope,
        // current service produced token
        iss: this._conf.jweIss,
        // for session initialization
        sub,
        // at
        iat: Date.now() / 1000,
        // which can be used from
        nbf: Date.now() / 1000 - 1,
        // up to
        exp: Date.now() / 1000 + ttl,
      }),
      "utf8",
    );
    const ce = new CompactEncrypt(payload).setProtectedHeader({
      alg: this._conf.jweAlg,
      enc: this._conf.jweEnc,
    });
    return await ce.encrypt(pub);
  }

  /**
   * Decrypts a `token` and returns its decripted payload.
   */
  public async parse(
    key: KeyLike,
    token: string,
  ): Promise<JWTPayload> {
    try {
      const jwt = await jwtDecrypt(decodeURIComponent(token), key);
      return jwt.payload;
    } catch (error) {
      throw new HttpException(
        (<Error>error).message,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /**
   * Returns access token.
   */
  public async getAccessToken(
    pub: null | KeyLike,
    ttl?: string,
    scope?: string,
  ): Promise<string> {
    if (!pub) {
      throw new HttpException(
        "Bad request (`key.pub` is missing)",
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!ttl) {
      throw new HttpException(
        "Bad request (`ttl` is required)",
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!scope) {
      throw new HttpException(
        "Bad request (`scope` is required)",
        HttpStatus.BAD_REQUEST,
      );
    }
    const _ttl = parseInt(ttl);
    let _scope: object;
    try {
      _scope = <object>JSON.parse(scope);
    } catch (error) {
      throw new HttpException(
        `Bad request (invalid \`scope\`: ${(<Error>error).message})`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (typeof _ttl !== "number" || isNaN(_ttl)) {
      throw new HttpException(
        "Bad request (`ttl` must be a number)",
        HttpStatus.BAD_REQUEST,
      );
    }
    if (typeof _scope !== "object") {
      throw new HttpException(
        "Bad request (`scope` must be an object)",
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.stringlify(
      pub,
      this._conf.jweSub,
      _ttl,
      _scope,
    );
  }

  /**
   * Returns session token.
   */
  public async getSessionToken(
    pub: null | KeyLike,
    key: null | KeyLike,
    token?: string,
  ): Promise<string> {
    if (!pub) {
      throw new HttpException(
        "Bad request (invalid tenant or `pub` is missing)",
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!key) {
      throw new HttpException(
        "Bad request (invalid tenant or `key` is missing)",
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!token) {
      throw new HttpException(
        "Bad request (`token` is required)",
        HttpStatus.BAD_REQUEST,
      );
    }
    let scope: JWTPayload;
    try {
      scope = await this.parse(key, token);
    } catch (error) {
      throw new HttpException(
        `Unauthorized (${(<Error>error).message})`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!scope.sub || scope.sub !== this._conf.jweSub) {
      throw new HttpException(
        "Bad request (`scope.sub` is missing or invalid)",
        HttpStatus.BAD_REQUEST,
      );
    }
    const session = await this.stringlify(
      pub,
      this._conf.jweSub,
      this._conf.jweTtl,
      scope,
    );
    return session;
  }

  /**
   * Returns session context.
   */
  public async getContext(
    key: null | KeyLike,
    token?: string,
  ): Promise<object> {
    if (!key) {
      throw new HttpException(
        "Bad request (invalid tenant or `key` is missing)",
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!token) {
      throw new HttpException(
        "Bad request (`token` is required)",
        HttpStatus.BAD_REQUEST,
      );
    }
    let payload: JWTPayload;
    try {
      payload = await this.parse(key, token);
    } catch (error) {
      throw new HttpException(
        `Unauthorized (${(<Error>error).message})`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!payload.sub || payload.sub !== this._conf.jweSub) {
      throw new HttpException(
        "Bad request (`scope.sub` is missing or invalid)",
        HttpStatus.BAD_REQUEST,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iss, sub, iat, nbf, exp, aud, jti, ...scope } = payload;
    return scope;
  }
}

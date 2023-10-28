/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { QueryDef } from "@hdml/schema";
import {
  Injectable,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import * as dotenv from "dotenv";
import { KeyLike } from "jose";
import { LRUCache } from "lru-cache";
import { CompilerFactory, Compiler } from "./Compiler";
import { Config } from "./Config";
import { Logger } from "./Logger";
import { Thread } from "./Thread";
import { Tokens } from "./Tokens";
import { Workdir } from "./Workdir";

/**
 * Tenant profile.
 */
type TenantProfile = {
  compiler?: Compiler;
  environment?: Record<string, string>;
  private?: KeyLike;
  public?: KeyLike;
  queries?: {
    [uri: string]: QueryDef;
  };
};

/**
 * Tenants service.
 */
@Injectable()
export class Tenants {
  private _cache: LRUCache<string, TenantProfile>;
  private _logger: Logger;

  /**
   * @constructor
   */
  public constructor(
    private _comp: CompilerFactory,
    private _conf: Config,
    private _thread: Thread,
    private _tokens: Tokens,
    private _workdir: Workdir,
  ) {
    this._logger = new Logger("Tenants", this._thread);
    this._cache = new LRUCache({
      allowStale: false,
      dispose: this.dispose,
      max: this._conf.cacheMax,
      ttl: 1000 * 60 * this._conf.cacheTtl,
      updateAgeOnGet: true,
      updateAgeOnHas: true,
    });
  }

  /**
   * Disposes off tenant's compiler.
   */
  private dispose = (value: TenantProfile, key: string) => {
    this._logger.log(`Removing a {/${key}} tenant from the cache`);
    value.compiler && value.compiler.release();
  };

  /**
   * Returns tenant's compiler object.
   */
  public async getCompiler(tenant: string): Promise<Compiler> {
    const profile = this.getProfile(tenant);
    if (!profile.compiler) {
      profile.compiler = await this._comp.getCompiler(
        "common",
        await this.getEnvironment(tenant),
      );
      this._cache.set(tenant, profile);
    }
    return profile.compiler;
  }

  /**
   * Returns tenant's environment object.
   */
  public async getEnvironment(
    tenant: string,
  ): Promise<Record<string, string>> {
    const profile = this.getProfile(tenant);
    if (!profile.environment) {
      profile.environment = dotenv.parse<Record<string, string>>(
        await this._workdir.openEnv(tenant),
      );
      this._cache.set(tenant, profile);
    }
    return profile.environment;
  }

  /**
   * Returns tenant's private key.
   */
  public async getPrivateKey(tenant: string): Promise<KeyLike> {
    const profile = this.getProfile(tenant);
    if (!profile.private) {
      profile.private = await this._tokens.getPrivateKey(
        await this._workdir.loadKey(tenant),
      );
      this._cache.set(tenant, profile);
    }
    return profile.private;
  }

  /**
   * Returns tenant's public key.
   */
  public async getPublicKey(tenant: string): Promise<KeyLike> {
    const profile = this.getProfile(tenant);
    if (!profile.public) {
      profile.public = await this._tokens.getPublicKey(
        await this._workdir.loadPub(tenant),
      );
      this._cache.set(tenant, profile);
    }
    return profile.public;
  }

  /**
   * Returns the `QueryDef` object for the specified `tenant` by its
   * `uri`.
   */
  public async getQueryDef(
    tenant: string,
    uri: string,
    depth = 0,
  ): Promise<QueryDef> {
    if (depth >= 25) {
      throw new HttpException(
        "Query definition depth exceeded",
        HttpStatus.BAD_REQUEST,
      );
    }
    const profile = this.getProfile(tenant);
    if (!profile.queries) {
      profile.queries = {};
      this._cache.set(tenant, profile);
    }
    if (!profile.queries[uri]) {
      const url = new URL(uri, "hdml://");
      const path = url.pathname;
      const compiler = await this.getCompiler(tenant);
      const fragment = await this._workdir.loadHdml(tenant, path);
      const elements = await compiler.compile(fragment);
      for (const name in elements.models) {
        const _uri = `${path}?${this._conf.querydefModel}=${name}`;
        const _model = elements.models[name];
        if (!profile.queries[_uri]) {
          profile.queries[_uri] = { model: _model };
          this._cache.set(tenant, profile);
        }
      }
      for (const name in elements.frames) {
        const _uri = `${path}?${this._conf.querydefFrame}=${name}`;
        const _frame = elements.frames[name];
        if (!profile.queries[_uri]) {
          profile.queries[_uri] = {
            model: undefined,
            frame: undefined,
          };
          this._cache.set(tenant, profile);
          const _sourceUri =
            _frame.source.indexOf("?") === 0
              ? `${path}${_frame.source}`
              : _frame.source;
          const _parentQueryDef = await this.getQueryDef(
            tenant,
            _sourceUri,
            depth++,
          );
          profile.queries[_uri] = {
            model: _parentQueryDef.model,
            frame: {
              ..._frame,
              parent: _parentQueryDef.frame,
            },
          };
          this._cache.set(tenant, profile);
        }
      }
    }
    if (!profile.queries[uri]) {
      throw new HttpException(
        `Invalid query URI: ${uri}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return profile.queries[uri];
  }

  /**
   * Returns tenant's profile from cache.
   */
  private getProfile(tenant: string): TenantProfile {
    let profile: TenantProfile;
    if (this._cache.has(tenant)) {
      profile = <TenantProfile>this._cache.get(tenant);
    } else {
      profile = {};
    }
    return profile;
  }
}

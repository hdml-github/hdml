/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { QueryDef } from "@hdml/schema";
import { Injectable } from "@nestjs/common";
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
    [path: string]: QueryDef;
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
    private _conf: Config,
    private _compiler: CompilerFactory,
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
      profile.compiler = await this._compiler.getCompiler(
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

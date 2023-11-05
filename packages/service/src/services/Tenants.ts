/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { FragmentDef } from "@hdml/elements";
import { getHTML } from "@hdml/orchestrator";
import { QueryDef, FrameDef } from "@hdml/schema";
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
import { Threads } from "./Threads";
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
    private _threads: Threads,
    private _tokens: Tokens,
    private _workdir: Workdir,
  ) {
    this._logger = new Logger("Tenants", this._threads);
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
   *
   */
  public async postQueryDef(
    tenant: string,
    query: QueryDef,
  ): Promise<void> {
    if (!query.model && !query.frame) {
      throw new HttpException(
        "Invalid (empty) query",
        HttpStatus.BAD_REQUEST,
      );
    } else {
      let q: QueryDef;
      if (query.model) {
        q = {
          model: query.model,
          frame: query.frame,
        };
      } else {
        const frame = <FrameDef>query.frame;
        let root = frame;
        while (root.parent) {
          root = root.parent;
        }
        const sourceDef = await this.getQueryDef(tenant, root.source);
        if (!sourceDef.model) {
          throw new HttpException(
            `Model is missing for the query`,
            HttpStatus.BAD_REQUEST,
          );
        }
        root.parent = sourceDef.frame;
        q = {
          model: sourceDef.model,
          frame,
        };
      }
      const html = getHTML(q);
      const compiler = await this.getCompiler(tenant);
      query = <QueryDef>await compiler.compile(html, true);
    }
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
    if (!uri) {
      throw new HttpException(
        "The uri parameter is required",
        HttpStatus.BAD_REQUEST,
      );
    }
    if (depth >= this._conf.querydefDepth) {
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
      const content = await this._workdir.loadHdml(tenant, path);
      const fragment = <null | FragmentDef>(
        await compiler.compile(content)
      );
      if (!fragment) {
        throw new HttpException(
          `No hdml content: ${path}`,
          HttpStatus.FAILED_DEPENDENCY,
        );
      } else {
        for (const name in fragment.models) {
          const _uri = `${path}?${this._conf.querydefModel}=${name}`;
          const _model = fragment.models[name];
          if (!profile.queries[_uri]) {
            profile.queries[_uri] = { model: _model };
            this._cache.set(tenant, profile);
          }
        }
        for (const name in fragment.frames) {
          const _uri = `${path}?${this._conf.querydefFrame}=${name}`;
          const _frame = fragment.frames[name];
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
    }
    if (!profile.queries[uri]) {
      throw new HttpException(
        `Invalid query uri: ${uri}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return profile.queries[uri];
  }

  /**
   * Returns the parsed queries `uri`s for the specified `tenant`.
   */
  public getUris(tenant: string): string[] {
    const profile = this.getProfile(tenant);
    if (profile.queries) {
      return Object.keys(profile.queries);
    } else {
      throw new HttpException(
        `No queries for the specified tenant: ${tenant}`,
        HttpStatus.NOT_FOUND,
      );
    }
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

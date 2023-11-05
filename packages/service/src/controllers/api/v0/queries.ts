/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { getHTML } from "@hdml/orchestrator";
import { QueryDef, QueryBuf, FrameDef } from "@hdml/schema";
import {
  Controller,
  UseGuards,
  Get,
  Post,
  Request,
  Query,
  StreamableFile,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { getHashname } from "../../../helpers/getHashname";
import { getHashtime } from "../../../helpers/getHashtime";
import { Auth } from "../../../guards/Auth";
import { Logger } from "../../../services/Logger";
import { Config } from "../../../services/Config";
import { Queues } from "../../../services/Queues";
import { Tenants } from "../../../services/Tenants";
import { Threads } from "../../../services/Threads";

/**
 * The `api/v0/queries` path controller.
 */
@Controller({ path: "api/v0/queries" })
@UseGuards(Auth)
export class queries {
  private _logger: Logger;

  /**
   * @constructor
   */
  constructor(
    private _conf: Config,
    private _queues: Queues,
    private _tenants: Tenants,
    private _threads: Threads,
  ) {
    this._logger = new Logger("api/v0/queries", this._threads);
  }

  /**
   * `POST ?tenant=:tenant` endpoint.
   */
  @Post()
  public async postQueries(
    @Query("tenant")
    tenant: string,
    @Request()
    request: FastifyRequest,
  ): Promise<StreamableFile> {
    try {
      const buf = new QueryBuf(<Buffer>request.body);
      const def: QueryDef = {
        model: buf.model,
        frame: buf.frame,
      };
      if (!def.model && !def.frame) {
        throw new HttpException(
          "Invalid (empty) query",
          HttpStatus.BAD_REQUEST,
        );
      } else if (!def.model) {
        await this.resolveModel(tenant, def);
      }
      const html = getHTML(def);
      const compiler = await this._tenants.getCompiler(tenant);
      const query = <QueryDef>await compiler.compile(html, true);
      const name = getHashname(JSON.stringify(query));
      const time = getHashtime(Date.now(), this._conf.queueTtl);
      const uri = `${name}.${time}.arr`;
      return this._queues.postQuery(uri, query);
    } catch (err) {
      this._logger.error(err);
      throw err;
    }
  }

  /**
   * `GET ?tenant=:tenant&uri=:uri` endpoint.
   */
  @Get()
  public async getQueries(
    @Query("tenant")
    tenant: string,
    @Query("uri")
    uri: string,
  ): Promise<StreamableFile> {
    try {
      return await this._queues.streamResults(uri);
    } catch (err) {
      this._logger.error(err);
      throw err;
    }
  }

  /**
   * Resolves model for the specified tenant and query definition.
   */
  private async resolveModel(
    tenant: string,
    def: QueryDef,
  ): Promise<void> {
    const frame = <FrameDef>def.frame;
    let root = frame;
    while (root.parent) {
      root = root.parent;
    }
    const source = await this._tenants.getQueryDef(
      tenant,
      root.source,
    );
    if (!source.model) {
      throw new HttpException(
        `Model is missing for the query`,
        HttpStatus.BAD_REQUEST,
      );
    }
    root.parent = source.frame;
    def.model = source.model;
  }
}

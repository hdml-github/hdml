/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
  StreamableFile,
} from "@nestjs/common";
import { FrameDef, QueryDef, Query as HdmlQuery } from "@hdml/schema";
import { getHTML } from "@hdml/orchestrator";
import { Queue } from "./Queue";
import { Compiler } from "./Compiler";
import { TenantFile } from "./Tenants";

/**
 * Query service.
 */
@Injectable()
export class Queries {
  /**
   * Service logger.
   */
  private readonly _logger = new Logger(Queries.name, {
    timestamp: true,
  });

  /**
   * Class constructor.
   */
  public constructor(
    private readonly _queue: Queue,
    private readonly _compiler: Compiler,
  ) {}

  /**
   * Posts the specified `query` and returns the name of the result
   * hdml file.
   */
  public async postQuery(
    tenant: string,
    file: TenantFile,
    context: object,
    query: HdmlQuery,
  ): Promise<StreamableFile> {
    const html = this.getCompletedHtmlFragment(tenant, file, query);
    const finalQuery = await this._compiler.getQuery(
      html,
      file.hook,
      context,
    );
    if (finalQuery) {
      try {
        return this._queue.postQuery(finalQuery);
      } catch (error) {
        const message = (<Error>error).message;
        throw new HttpException(
          message,
          HttpStatus.FAILED_DEPENDENCY,
        );
      }
    } else {
      throw new HttpException(
        `Final query was not compiled`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Returns the result `file` stream.
   */
  public async getResultFileStream(
    file: string,
  ): Promise<StreamableFile> {
    return this._queue.getResultFileStream(file);
  }

  /**
   * Returns a completed `html` fragment describing the specified
   * `query` for the specified `tenant`.
   */
  public getCompletedHtmlFragment(
    tenant: string,
    file: TenantFile,
    query: HdmlQuery,
  ): string {
    return getHTML(this.completeQuery(tenant, file, query));
  }

  /**
   * Returns complete query.
   */
  public completeQuery(
    tenant: string,
    file: TenantFile,
    query: HdmlQuery,
  ): HdmlQuery {
    if (!this.isValidQuery(query)) {
      throw new HttpException(
        "Invalid query",
        HttpStatus.BAD_REQUEST,
      );
    }
    if (this.isCompletedQuery(query)) {
      return query;
    } else {
      const frame = <FrameDef>query.frame;
      let parent = frame;
      while (parent.parent) parent = parent.parent;
      const storedQueryDef = this.getStoredQueryDef(
        tenant,
        file,
        parent.source,
      );
      if (!storedQueryDef) {
        throw new HttpException(
          `DocumentData is missing: ${parent.source}`,
          HttpStatus.NOT_FOUND,
        );
      }
      if (!storedQueryDef.model) {
        throw new HttpException(
          `Query model is missing: ${parent.source}`,
          HttpStatus.NOT_FOUND,
        );
      }
      parent.parent = storedQueryDef.frame;
      return new HdmlQuery({
        model: storedQueryDef.model,
        frame,
      });
    }
  }

  /**
   * Returns stored query definition specified by the `uri` for the
   * specified `tenant`, or `null` otherwise.
   */
  public getStoredQueryDef(
    tenant: string,
    file: TenantFile,
    uri: string,
  ): null | QueryDef {
    const def = file.defs[uri];
    return def || null;
  }

  /**
   * Determine whether specified `query` is valid or not.
   */
  private isValidQuery(query: HdmlQuery): boolean {
    return !!query.model || !!query.frame;
  }

  /**
   * Determine whether specified `query` is completed or not.
   */
  private isCompletedQuery(query: HdmlQuery): boolean {
    return !!query.model;
  }
}

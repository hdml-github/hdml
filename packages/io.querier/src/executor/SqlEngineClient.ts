/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { URL } from "url";
import { Agent as HttpAgent, request as HttpRequest } from "http";
import { Agent as HttpsAgent, request as HttpsRequest } from "https";
import * as JsonParser from "json-bigint";

type AdapterAgent = typeof HttpAgent | typeof HttpsAgent;
type AdapterRequest = typeof HttpRequest | typeof HttpsRequest;

interface Adapter {
  Agent: AdapterAgent;
  request: AdapterRequest;
}

/**
 * Returns a network `Adapter` based on the specified `protocol`.
 */
function getAdapter(protocol: "http:" | "https:"): Adapter {
  switch (protocol) {
    case "http:":
      return {
        Agent: HttpAgent,
        request: HttpRequest,
      };
    case "https:":
      return {
        Agent: HttpsAgent,
        request: HttpsRequest,
      };
  }
}

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

type HeaderKey =
  | "USER"
  | "SOURCE"
  | "CATALOG"
  | "SCHEMA"
  | "TIME_ZONE"
  | "CURRENT_STATE"
  | "MAX_WAIT"
  | "MAX_SIZE"
  | "PAGE_SEQUENCE_ID"
  | "SESSION"
  | "PREPARE"
  | "USER_AGENT"
  | "AUTHORIZATION";

type HeaderValue =
  // presto
  | "X-Presto-User"
  | "X-Presto-Source"
  | "X-Presto-Catalog"
  | "X-Presto-Schema"
  | "X-Presto-Time-Zone"
  | "X-Presto-Current-State"
  | "X-Presto-Max-Wait"
  | "X-Presto-Max-Size"
  | "X-Presto-Page-Sequence-Id"
  | "X-Presto-Session"
  | "X-Presto-Prepared-Statement"
  // trino
  | "X-Trino-User"
  | "X-Trino-Source"
  | "X-Trino-Catalog"
  | "X-Trino-Schema"
  | "X-Trino-Time-Zone"
  | "X-Trino-Current-State"
  | "X-Trino-Max-Wait"
  | "X-Trino-Max-Size"
  | "X-Trino-Page-Sequence-Id"
  | "X-Trino-Session"
  | "X-Trino-Prepared-Statement"
  // common
  | "User-Agent"
  | "Authorization";

type HeadersDict = {
  [header in HeaderKey]: HeaderValue;
};

type Headers = {
  [header in HeaderValue]?: string;
};

const PrestoHeaders: HeadersDict = {
  USER: "X-Presto-User",
  SOURCE: "X-Presto-Source",
  CATALOG: "X-Presto-Catalog",
  SCHEMA: "X-Presto-Schema",
  TIME_ZONE: "X-Presto-Time-Zone",
  CURRENT_STATE: "X-Presto-Current-State",
  MAX_WAIT: "X-Presto-Max-Wait",
  MAX_SIZE: "X-Presto-Max-Size",
  PAGE_SEQUENCE_ID: "X-Presto-Page-Sequence-Id",
  SESSION: "X-Presto-Session",
  PREPARE: "X-Presto-Prepared-Statement",
  USER_AGENT: "User-Agent",
  AUTHORIZATION: "Authorization",
};

const TrinoHeaders: HeadersDict = {
  USER: "X-Trino-User",
  SOURCE: "X-Trino-Source",
  CATALOG: "X-Trino-Catalog",
  SCHEMA: "X-Trino-Schema",
  TIME_ZONE: "X-Trino-Time-Zone",
  CURRENT_STATE: "X-Trino-Current-State",
  MAX_WAIT: "X-Trino-Max-Wait",
  MAX_SIZE: "X-Trino-Max-Size",
  PAGE_SEQUENCE_ID: "X-Trino-Page-Sequence-Id",
  SESSION: "X-Trino-Session",
  PREPARE: "X-Trino-Prepared-Statement",
  USER_AGENT: "User-Agent",
  AUTHORIZATION: "Authorization",
};

/**
 * Status of the SQL engine response.
 */
export type ResponseState =
  | "QUEUED"
  | "PLANNING"
  | "STARTING"
  | "RUNNING"
  | "FINISHED"
  | "CANCELED"
  | "FAILED";

/**
 * SQL engine data column definition.
 */
export type DataColumn = {
  name: string;
  type: string;
  typeSignature: {
    rawType: string;
    arguments: Array<{
      kind: string;
      value: number;
    }>;
  };
};

/**
 * SQL engine data row definition.
 */
export type DataRow = Array<null | number | string>;

/**
 * SQL engine data response definition.
 */
export interface DataResponse {
  id: string;
  infoUri: string;
  partialCancelUri?: string;
  nextUri?: string;
  columns?: Array<DataColumn>;
  data?: Array<DataRow>;
  stats: {
    state: ResponseState;
    queued: boolean;
    scheduled: boolean;
    nodes: number;
    totalSplits: number;
    queuedSplits: number;
    runningSplits: number;
    completedSplits: number;
    cpuTimeMillis: number;
    wallTimeMillis: number;
    queuedTimeMillis: number;
    elapsedTimeMillis: number;
    processedRows: number;
    processedBytes: number;
    physicalInputBytes: number;
    peakMemoryBytes: number;
    spilledBytes: number;
    rootStage: {
      stageId: string;
      state: string;
      done: boolean;
      nodes: number;
      totalSplits: number;
      queuedSplits: number;
      runningSplits: number;
      completedSplits: number;
      cpuTimeMillis: number;
      wallTimeMillis: number;
      processedRows: number;
      processedBytes: number;
      physicalInputBytes: number;
      failedTasks: number;
      coordinatorOnly: boolean;
      subStages: unknown[];
    };
    progressPercentage?: number;
  };
  warnings: unknown[];
  error?: {
    message: string;
    errorCode: number;
    errorName: string;
    errorType: string;
    errorLocation: {
      lineNumber: number;
      columnNumber: number;
    };
    failureInfo: {
      type: string;
      message: string;
      cause: {
        type: string;
        suppressed: unknown[];
        stack: string[];
      };
      suppressed: unknown[];
      stack: string[];
      errorLocation: {
        lineNumber: number;
        columnNumber: number;
      };
    };
  };
}

/**
 * SQL engine client settings.
 */
export type Options = {
  engine: "presto" | "trino";
  host?: string;
  port?: number;
  user?: string;
  custom_auth?: string;
  basic_auth?: {
    user: string;
    password: string;
  };
  ssl?: object;
  catalog?: string;
  schema?: string;
  source?: string;
  jsonParser?: {
    parse: (data: string) => object;
    stringify: (data: object) => string;
  };
};

/**
 * HTTP client for the SQL query engine.
 */
export class SqlEngineClient {
  private _version = "0.0.0";
  private _headers: HeadersDict;
  private _userAgent: string;
  private _source: string;
  private _host: string;
  private _port: number;
  private _user: string;
  private _catalog: null | string = null;
  private _schema: null | string = null;
  private _authorization: null | string = null;
  private _protocol: "http:" | "https:";
  private _ssl: null | object = null;
  private _jsonParser: {
    parse: (data: string) => object;
    stringify: (data: object) => string;
  };
  private _adapter: Adapter;

  /**
   * Class constructor.
   */
  constructor(options: Options) {
    if (options.custom_auth && options.basic_auth) {
      throw new Error(
        "Both params `custom_auth` and `basic_auth` are specified.",
      );
    }
    if (options.schema && !options.catalog) {
      throw new Error(
        "A catalog is required if a schema is provided.",
      );
    }
    this._headers =
      options.engine === "presto" ? PrestoHeaders : TrinoHeaders;
    this._userAgent = `hdml-client@${this._version}`;
    this._source = options.source || "hdml-client";
    this._host = options.host || "localhost";
    this._port = options.port || 8080;
    this._user = options.user || "hdml";
    this._catalog = options.catalog || null;
    this._schema = options.schema || null;
    this._jsonParser = options.jsonParser || JsonParser;

    if (options.custom_auth) {
      this._authorization = options.custom_auth;
    } else if (options.basic_auth) {
      this._authorization =
        "Basic " +
        Buffer.from(
          `${options.basic_auth.user}:${options.basic_auth.password}`,
        ).toString("base64");
    }
    if (!options.ssl) {
      this._protocol = "http:";
    } else {
      this._protocol = "https:";
      this._ssl = options.ssl;
    }
    this._adapter = getAdapter(this._protocol);
  }

  /**
   * Returns the status of the engine cluster.
   */
  public async getClusterInfo(): Promise<unknown> {
    const [code, data] = await this.request({
      method: "GET",
      path: "/v1/cluster",
    });
    if (code === 200) {
      return data;
    } else {
      throw new Error(`Cluster info API failed: ${code || "0"}.`);
    }
  }

  /**
   * Returns active or failed cluster nodes.
   */
  public async getNodesInfo(failed: boolean): Promise<unknown> {
    const [code, data] = await this.request({
      method: "GET",
      path: `/v1/node${failed ? "/failed" : ""}`,
    });
    if (code === 200) {
      return data;
    } else {
      throw new Error(`Nodes info API failed: ${code || "0"}.`);
    }
  }

  /**
   * Retrieves information about the query by the provided `id`.
   */
  public async getQueryInfo(id: string): Promise<unknown> {
    const [code, data] = await this.request({
      method: "GET",
      path: `/v1/query/${id}`,
    });
    if (code === 200) {
      return data;
    } else {
      throw new Error(`Query info API failed: ${code || "0"}.`);
    }
  }

  /**
   * Delete the query by the provided `id`.
   */
  public async deleteQuery(id: string): Promise<unknown> {
    const [code, data] = await this.request({
      method: "DELETE",
      path: `/v1/query/${id}`,
    });
    if (code === 200) {
      return data;
    } else {
      throw new Error(`Query delete API failed: ${code || "0"}.`);
    }
  }

  /**
   * Posts the SQL `statement`.
   */
  public async post(
    statement: string,
    options: {
      session?: string;
      prepares?: string[] | number[] | boolean[];
      timezone?: string;
    },
  ): Promise<DataResponse> {
    const headers: Headers = {};
    if (this._catalog) {
      headers[this._headers.CATALOG] = this._catalog;
    }
    if (this._schema) {
      headers[this._headers.SCHEMA] = this._schema;
    }
    if (options.session) {
      headers[this._headers.SESSION] = options.session;
    }
    if (options.timezone) {
      headers[this._headers.TIME_ZONE] = options.timezone;
    }
    if (options.prepares) {
      headers[this._headers.PREPARE] = options.prepares
        .map((s, i) => `query${i}=${encodeURIComponent(s)}`)
        .join(",");
    }
    const [code, data] = <[number, DataResponse]>await this.request({
      method: "POST",
      path: "/v1/statement",
      headers,
      body: statement,
      user: this._user,
    });
    if (code !== 200) {
      throw new Error(`Statement execution error: ${code}.`);
    }
    if (!data.id) {
      throw new Error("Query identifier is missing.");
    }
    if (!data.nextUri) {
      throw new Error("Query next URI is missing.");
    }
    if (!data.infoUri) {
      throw new Error("Query info URI is missing.");
    }
    return data;
  }

  /**
   * Fetches the next chunk of the requested data.
   */
  public async fetch(next: string): Promise<DataResponse> {
    const [code, data] = <[number, DataResponse]>(
      await this.request({ uri: next })
    );
    if (code !== 200) {
      throw new Error(`Fetch next error: ${code}.`);
    }
    if (!data.id) {
      throw new Error("Identifier is missing.");
    }
    if (!data.infoUri) {
      throw new Error("Info URI is missing.");
    }
    return data;
  }

  /**
   * Cancels the next chunk of the requested data.
   */
  public async cancel(next: string): Promise<boolean> {
    const [code] = await this.request({
      path: next,
      method: "DELETE",
    });
    if (code !== 204) {
      throw new Error(`Cancel next API error: ${code || "0"}`);
    } else {
      return true;
    }
  }

  /**
   * Sends the request to the engine.
   */
  private async request(options: {
    uri?: string;
    method?: RequestMethod;
    path?: string;
    headers?: Headers;
    user?: string;
    body?: string;
  }): Promise<[code: undefined | number, data: unknown]> {
    let method: RequestMethod;
    let host: string;
    let port: number;
    let path: string;
    let headers: Headers;
    let body: null | string = null;
    return new Promise((resolve, reject) => {
      if (options.uri) {
        try {
          const href = new URL(options.uri);
          method = "GET";
          host = href.hostname;
          port =
            parseInt(href.port) ||
            (href.protocol === "https:" ? 443 : 80);
          path = href.pathname + href.search;
          headers = {};
        } catch (err: unknown) {
          reject(err);
        }
      } else {
        method = <RequestMethod>options.method;
        host = this._host;
        port = this._port;
        path = <string>options.path;
        headers = options.headers || {};
        body = options.body || null;
      }
      const params = {
        protocol: this._protocol,
        method,
        host,
        port,
        path,
        headers,
        user: options.user || this._user,
        ...this._ssl,
      };
      params.headers[this._headers.USER] = this._user;
      params.headers[this._headers.SOURCE] = this._source;
      params.headers[this._headers.USER_AGENT] = this._userAgent;
      if (this._authorization) {
        params.headers[this._headers.AUTHORIZATION] =
          this._authorization;
      }
      const agent = new this._adapter.Agent(params);
      const req = this._adapter.request(
        {
          agent,
          ...params,
        },
        (res) => {
          const code = res.statusCode;
          let response_data = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            response_data += chunk;
          });
          res.on("end", () => {
            let data: string | object = response_data;
            if (
              code &&
              code < 300 &&
              (data[0] === "{" || data[0] === "[")
            ) {
              try {
                data = this._jsonParser.parse(data);
                resolve([code, data]);
              } catch (error) {
                reject(error);
              }
            }
          });
        },
      );
      req.on("error", function (err) {
        reject(err);
      });
      body && req.write(body);
      req.end();
    });
  }
}

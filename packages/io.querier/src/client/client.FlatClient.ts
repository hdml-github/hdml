import { URL } from "url";
import { getAdapter, Adapter } from "./helpers.getAdapter";
import {
  HeadersDict,
  Headers,
  PrestoHeaders,
  TrinoHeaders,
} from "./helpers.getHeaders";
import { ClientOptions } from "./types.ClientOptions";
import { DataResponse } from "./types.Response";
import { HttpMethod } from "./types.HttpMethod";

export class FlatClient {
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
  private _protocol: string;
  private _ssl: null | object = null;
  private _jsonParser: {
    parse: (data: string) => object;
    stringify: (data: object) => string;
  };
  private _adapter: Adapter;

  /**
   * Class constructor.
   */
  constructor(options: ClientOptions) {
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
    this._jsonParser = options.jsonParser || JSON;

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
   * Returns status of an engine cluster.
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
   * Fetches active or failed cluster nodes.
   * @throws
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
   * Fetches a query info by provided identifier.
   * @throws
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
   * Fetches a query info by provided identifier.
   * @throws
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
   * Posts SQL statement on an engine.
   * @throws
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
   * Fetches the next chunk of requested data from the engine.
   * @throws
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
   * Cancel the next chunk.
   * @throws
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
   * Sends a request to an engine.
   * @throws
   */
  private async request(options: {
    uri?: string;
    method?: HttpMethod;
    path?: string;
    headers?: Headers;
    user?: string;
    body?: string;
  }): Promise<[code: undefined | number, data: unknown]> {
    let method: HttpMethod;
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
        method = <HttpMethod>options.method;
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
              } finally {
                resolve([code, data]);
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

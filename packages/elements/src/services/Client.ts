/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import "whatwg-fetch";
import { Table, tableFromIPC } from "apache-arrow";
import { File } from "@hdml/schema";

let sessionToken: null | string = null;

/**
 * Network client class.
 */
export class Client {
  private _initialized = false;
  private _postedQueries: Map<
    string,
    [AbortController, Promise<string>]
  > = new Map();
  private _downloadableFiles: Map<
    string,
    [AbortController, Promise<Table>]
  > = new Map();

  /**
   * Class constructor.
   */
  public constructor(
    private _url = "",
    private _tenant = "",
    private _token = "",
  ) {
    if (
      _url &&
      _url.length &&
      _tenant &&
      _tenant.length &&
      _token &&
      _token.length &&
      _token !== "compiler_token"
    ) {
      this.initialize().catch(console.error);
    }
  }

  /**
   * Submits a request for execution. Returns the identifier of the
   * file with the results of the request.
   */
  public async postQuery(uid: string, body: Buffer): Promise<string> {
    if (!this._initialized) {
      throw new Error("Client is not initialized");
    } else {
      if (!this._postedQueries.has(uid)) {
        const abort = new AbortController();
        const promise = this.postQueryInternal(
          uid,
          body,
          abort.signal,
        );
        this._postedQueries.set(uid, [abort, promise]);
      }
      return (<[AbortController, Promise<string>]>(
        this._postedQueries.get(uid)
      ))[1];
    }
  }

  /**
   * Downloads a file with the results of a query. Returns a table
   * with query data in `arrow.Table` format.
   */
  public async getFile(uid: string, name: string): Promise<Table> {
    if (!this._initialized) {
      throw new Error("Client is not initialized");
    } else {
      if (!this._downloadableFiles.has(uid)) {
        const abort = new AbortController();
        const promise = this.getFileInternal(uid, name, abort.signal);
        this._downloadableFiles.set(uid, [abort, promise]);
      }
      return (<[AbortController, Promise<Table>]>(
        this._downloadableFiles.get(uid)
      ))[1];
    }
  }

  /**
   * Closes the client, canceling all active requests and downloads.
   */
  public close(): void {
    sessionToken = null;
    this._initialized = false;
    this._postedQueries.forEach((tuple, uid) => {
      this.cancelPostQuery(uid);
    });
    this._downloadableFiles.forEach((tuple, uid) => {
      this.cancelGetFile(uid);
    });
  }

  /**
   * Initializes a session.
   */
  private async initialize(): Promise<void> {
    try {
      const response = await this.fetch({
        method: "GET",
        api: "session",
        params: { token: this._token },
      });
      this._initialized = true;
      sessionToken = await response.text();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Internal implementation of sending a request.
   */
  private async postQueryInternal(
    uid: string,
    body: Buffer,
    signal: AbortSignal,
  ): Promise<string> {
    const resp = await this.fetch({
      method: "POST",
      api: "query",
      signal,
      body,
    });
    const buff = await resp.arrayBuffer();
    const file = new File(new Uint8Array(buff));
    if (this._postedQueries.has(uid)) {
      this._postedQueries.delete(uid);
    }
    return file.name;
  }

  /**
   * Internal implementation of downloading a file.
   */
  private async getFileInternal(
    uid: string,
    name: string,
    signal: AbortSignal,
  ): Promise<Table> {
    const response = await this.fetch({
      method: "GET",
      api: "query",
      path: `/${name}`,
      signal,
    });
    const buffer = await response.arrayBuffer();
    const table = tableFromIPC(<Buffer>buffer);
    if (this._downloadableFiles.has(uid)) {
      this._downloadableFiles.delete(uid);
    }
    return table;
  }

  /**
   * Internal implementation of fetching remote resource.
   */
  private async fetch(config: {
    method: "GET" | "POST" | "PUT" | "DELETE";
    api: "session" | "query";
    path?: string;
    params?: Record<string, string>;
    signal?: AbortSignal;
    body?: Buffer;
  }): Promise<Response> {
    const { method, api, path, params, signal, body } = config;
    const query = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    const url =
      `${this._url}/${this._tenant}/api/v0` +
      `/${api}${path ? path : ""}${query}`;
    const response = await fetch(url, {
      method,
      mode: "cors",
      redirect: "follow",
      cache: "no-cache",
      headers: {
        Session: sessionToken || "",
      },
      signal,
      body,
    });
    if (!response.ok) {
      const message = <{ statusCode?: number; message?: string }>(
        await response.json()
      );
      throw new Error(message.message || response.statusText);
    } else {
      return response;
    }
  }

  /**
   * Cancels sending the query.
   */
  private cancelPostQuery(uid: string): void {
    if (this._postedQueries.has(uid)) {
      (<[AbortController, Promise<string>]>(
        this._postedQueries.get(uid)
      ))[0].abort();
      this._postedQueries.delete(uid);
    }
  }

  /**
   * Cancels the download of a file.
   */
  private cancelGetFile(uid: string): void {
    if (this._downloadableFiles.has(uid)) {
      (<[AbortController, Promise<Table>]>(
        this._downloadableFiles.get(uid)
      ))[0].abort();
      this._downloadableFiles.delete(uid);
    }
  }
}

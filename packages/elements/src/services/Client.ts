/**
 * @fileoverview The `Client` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import "whatwg-fetch";
import { Table, tableFromIPC } from "apache-arrow";
import { Name } from "@hdml/schema";

let sessionToken: null | string = null;

/**
 * Data client class.
 */
export class Client {
  private _initialized = false;
  private _postedHdmls: Map<
    string,
    [AbortController, Promise<string>]
  > = new Map();
  private _requestedHdmls: Map<
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
   * Sends a `Document` with the specified `uid` and `body` and
   * returns its name.
   */
  public async hdmlPost(uid: string, body: Buffer): Promise<string> {
    if (!this._initialized) {
      throw new Error("Client is not initialized");
    } else {
      if (!this._postedHdmls.has(uid)) {
        const abort = new AbortController();
        const promise = this.hdmlPostInternal(
          uid,
          body,
          abort.signal,
        );
        this._postedHdmls.set(uid, [abort, promise]);
      }
      return (<[AbortController, Promise<string>]>(
        this._postedHdmls.get(uid)
      ))[1];
    }
  }

  /**
   * Retrieves the `Document` data stream and returns parsed `Table`.
   */
  public async hdmlGet(uid: string, name: string): Promise<Table> {
    if (!this._initialized) {
      throw new Error("Client is not initialized");
    } else {
      if (!this._requestedHdmls.has(uid)) {
        const abort = new AbortController();
        const promise = this.hdmlGetInternal(uid, name, abort.signal);
        this._requestedHdmls.set(uid, [abort, promise]);
      }
      return (<[AbortController, Promise<Table>]>(
        this._requestedHdmls.get(uid)
      ))[1];
    }
  }

  /**
   * Close client by cancelling every active fetch.
   */
  public close(): void {
    sessionToken = null;
    this._initialized = false;
    this._postedHdmls.forEach((tuple, uid) => {
      this.hdmlPostCancel(uid);
    });
    this._requestedHdmls.forEach((tuple, uid) => {
      this.hdmlGetCancel(uid);
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

  private async hdmlPostInternal(
    uid: string,
    body: Buffer,
    signal: AbortSignal,
  ): Promise<string> {
    const resp = await this.fetch({
      method: "POST",
      api: "hdml",
      signal,
      body,
    });
    const buff = await resp.arrayBuffer();
    const name = new Name(new Uint8Array(buff));
    if (this._postedHdmls.has(uid)) {
      this._postedHdmls.delete(uid);
    }
    return name.value;
  }

  private async hdmlGetInternal(
    uid: string,
    name: string,
    signal: AbortSignal,
  ): Promise<Table> {
    const response = await this.fetch({
      method: "GET",
      api: "hdml",
      path: `/${name}`,
      signal,
    });
    const buffer = await response.arrayBuffer();
    const table = tableFromIPC(<Buffer>buffer);
    if (this._requestedHdmls.has(uid)) {
      this._requestedHdmls.delete(uid);
    }
    return table;
  }

  /**
   * Fetches remote resource.
   */
  private async fetch(config: {
    method: "GET" | "POST" | "PUT" | "DELETE";
    api: "session" | "hdml";
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

  private hdmlPostCancel(uid: string): void {
    if (this._postedHdmls.has(uid)) {
      (<[AbortController, Promise<string>]>(
        this._postedHdmls.get(uid)
      ))[0].abort();
      this._postedHdmls.delete(uid);
    }
  }

  private hdmlGetCancel(uid: string): void {
    if (this._requestedHdmls.has(uid)) {
      (<[AbortController, Promise<Table>]>(
        this._requestedHdmls.get(uid)
      ))[0].abort();
      this._requestedHdmls.delete(uid);
    }
  }
}

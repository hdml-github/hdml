/**
 * @fileoverview The `Client` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import "whatwg-fetch";
import { Table, tableFromIPC } from "apache-arrow";
import { Document } from "@hdml/schema";

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

  private _promises: Map<string, Promise<Table>> = new Map();
  private _controllers: Map<string, AbortController> = new Map();

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
      _token.length
    ) {
      this.initialize().catch(console.error);
    }
  }

  /**
   * Close client by cancelling every active fetch.
   */
  public close(): void {
    sessionToken = null;
    this._initialized = false;
    this._postedHdmls.forEach((tuple, uid) => {
      this.hdmlCancel(uid);
    });
  }

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
    const identifier = await resp.text();
    if (this._postedHdmls.has(uid)) {
      this._postedHdmls.delete(uid);
    }
    return identifier;
  }

  private hdmlCancel(uid: string): void {
    if (this._postedHdmls.has(uid)) {
      (<[AbortController, Promise<string>]>(
        this._postedHdmls.get(uid)
      ))[0].abort();
      this._postedHdmls.delete(uid);
    }
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
   * Fetches remote resource.
   */
  private async fetch(config: {
    method: "GET" | "POST" | "PUT" | "DELETE";
    api: "session" | "hdml";
    params?: Record<string, string>;
    signal?: AbortSignal;
    body?: Buffer;
  }): Promise<Response> {
    const { method, api, params, signal, body } = config;
    const query = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    const url = `${this._url}/${this._tenant}/api/v0/${api}${query}`;
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
}

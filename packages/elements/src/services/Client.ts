/**
 * @fileoverview The `Client` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import "whatwg-fetch";
import { Table, tableFromIPC } from "apache-arrow";

/**
 * Data client class.
 */
export class Client {
  private _promises: Map<string, Promise<Table>> = new Map();
  private _controllers: Map<string, AbortController> = new Map();

  /**
   * Class constructor.
   */
  public constructor(
    private _url = "http://localhost",
    private _tenant = "common",
    private _token = "token_value",
  ) {}

  /**
   * Returns a promise that will be resolved with the fetched document
   * data table.
   */
  public async fetch(uid: string, doc: Buffer): Promise<Table> {
    if (this._promises.has(uid)) {
      return <Promise<Table>>this._promises.get(uid);
    } else {
      const controller = new AbortController();
      const promise = new Promise(
        (resolve: (v: Table) => void, reject) => {
          fetch(this._url, {
            method: "POST",
            mode: "cors",
            redirect: "follow",
            cache: "no-cache",
            headers: {
              Accept: "text/html; charset=utf-8",
              "Content-Type": "text/html; charset=utf-8",
            },
            signal: controller.signal,
            body: doc,
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network error.");
              } else {
                response
                  .arrayBuffer()
                  .then((buff) => {
                    this._clear(uid);
                    const array = new Uint8Array(buff);
                    resolve(tableFromIPC(array));
                  })
                  .catch((reason) => {
                    this._clear(uid);
                    reject(reason);
                  });
              }
            })
            .catch((reason) => {
              this._clear(uid);
              reject(reason);
            });
        },
      );
      this._controllers.set(uid, controller);
      this._promises.set(uid, promise);
      return promise;
    }
  }

  /**
   * Cancel document fetching.
   */
  public cancel(uid: string): boolean {
    if (this._controllers.has(uid) && this._promises.has(uid)) {
      this._controllers.get(uid)?.abort();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Close client by cancelling every active fetch.
   */
  public close(): void {
    this._controllers.forEach((ctrl, uid) => {
      this.cancel(uid);
    });
  }

  private _clear(uid: string): void {
    if (this._controllers.has(uid)) {
      this._controllers.delete(uid);
    }
    if (this._promises.has(uid)) {
      this._promises.delete(uid);
    }
  }
}

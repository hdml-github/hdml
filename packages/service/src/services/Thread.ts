/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { AsyncLocalStorage } from "async_hooks";
import { Injectable } from "@nestjs/common";

/**
 * Async thread storage service.
 */
@Injectable()
export class Thread {
  private _storage = new AsyncLocalStorage<string>();

  /**
   * Starts storage cycle by saving the `uid` string in the
   * `AsyncLocalStorage`.
   */
  public start(uid: string, next: () => void): void {
    this._storage.run(uid, next);
  }

  /**
   * Returns the async thread `uid`.
   */
  public getUid(): null | string {
    return this._storage.getStore() || null;
  }
}

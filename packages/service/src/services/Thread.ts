/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { AsyncLocalStorage } from "async_hooks";
import { Injectable } from "@nestjs/common";

type ReqScope = Record<string, unknown> & { uid: string };

/**
 * Async thread storage service.
 */
@Injectable()
export class Thread {
  private _storage = new AsyncLocalStorage<ReqScope>();

  /**
   * Starts storage cycle by saving the `scope` object in the
   * `AsyncLocalStorage`.
   */
  public start(scope: ReqScope, next: () => void): void {
    this._storage.run(scope, next);
  }

  /**
   * Sets the async thread `scope`.
   */
  public setScope(obj: Record<string, unknown>): boolean {
    const store = this._storage.getStore();
    if (!store) {
      return false;
    } else {
      for (const key in obj) {
        store[key] = obj[key];
      }
      return true;
    }
  }

  /**
   * Returns the async thread `scope`.
   */
  public getScope(): null | ReqScope {
    return this._storage.getStore() || null;
  }
}

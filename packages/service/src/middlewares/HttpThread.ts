/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Injectable, NestMiddleware } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { getUid } from "../helpers/getUid";
import { Thread } from "../services/Thread";

/**
 * The `http` thread middleware.
 */
@Injectable()
export class HttpThread implements NestMiddleware {
  constructor(private _thread: Thread) {}

  /**
   * Runs async thread by saving `http` identifier.
   */
  use(req: FastifyRequest, res: unknown, next: () => void): void {
    const uid = !req.headers["uid"]
      ? getUid()
      : Array.isArray(req.headers["uid"])
      ? req.headers["uid"][0]
      : req.headers["uid"];
    this._thread.start(uid, next);
  }
}

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Injectable, NestMiddleware } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { getUid } from "../helpers/getUid";
import { Threads } from "../services/Threads";

/**
 * The `http` thread middleware.
 */
@Injectable()
export class HttpThread implements NestMiddleware {
  constructor(private _threads: Threads) {}

  /**
   * Runs async thread by saving `http` identifier.
   */
  use(req: FastifyRequest, res: unknown, next: () => void): void {
    const uid = !req.headers["uid"]
      ? getUid()
      : Array.isArray(req.headers["uid"])
      ? req.headers["uid"][0]
      : req.headers["uid"];
    this._threads.start({ uid }, next);
  }
}

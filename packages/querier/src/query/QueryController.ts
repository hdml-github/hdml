import * as rawbody from "raw-body";
import { Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { QueryServiceV1 } from "./QueryServiceV1";

@Controller()
export class QueryController {
  constructor(private readonly queryService: QueryServiceV1) {}

  @Post()
  async statement(@Req() req: Request): Promise<string> {
    if (req.readable) {
      const buff = await rawbody(req);
      const stmt = buff.toString().trim();
      return this.queryService.executeChunk(stmt);
    } else {
      throw new Error("Can't parse the request body.");
    }
  }
}

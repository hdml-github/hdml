import * as rawbody from "raw-body";
import { Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { QueryV1Service } from "./QueryService.v1";

@Controller()
export class QueryController {
  constructor(private readonly queryService: QueryV1Service) {}

  @Post()
  async statement(@Req() req: Request): Promise<void> {
    if (req.readable) {
      const buff = await rawbody(req);
      const stmt = buff.toString().trim();
      return this.queryService.execute(stmt);
    } else {
      throw new Error("Can't parse the request body.");
    }
  }
}

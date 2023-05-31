import * as rawbody from "raw-body";
import {
  Controller,
  Post,
  Req,
  StreamableFile,
} from "@nestjs/common";
import { Request } from "express";
import { QueryServiceV1 } from "./QueryServiceV1";

@Controller()
export class QueryController {
  constructor(private readonly queryService: QueryServiceV1) {}

  @Post()
  async statement(@Req() req: Request): Promise<StreamableFile> {
    if (req.readable) {
      const buff = await rawbody(req);
      const stmt = buff.toString().trim();
      return this.queryService.executeBin(stmt);
    } else {
      throw new Error("Can't parse the request body.");
    }
  }
}

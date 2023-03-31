import { Module } from "@nestjs/common";
import { QueryController } from "./QueryController";
import { QueryV1Service } from "./QueryService.v1";

@Module({
  controllers: [QueryController],
  providers: [QueryV1Service],
})
export class QueryModule {}

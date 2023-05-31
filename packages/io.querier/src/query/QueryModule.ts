import { Module } from "@nestjs/common";
import { QueryController } from "./QueryController";
import { QueryServiceV1 } from "./QueryServiceV1";

@Module({
  imports: [],
  exports: [],
  controllers: [QueryController],
  providers: [QueryServiceV1],
})
export class QueryModule {}

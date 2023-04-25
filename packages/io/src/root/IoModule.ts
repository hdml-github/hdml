import { Module } from "@nestjs/common";
import { IoController } from "./IoController";
import { IoServiceV0 } from "./IoServiceV0";

@Module({
  controllers: [IoController],
  providers: [IoServiceV0],
})
export class IoModule {}

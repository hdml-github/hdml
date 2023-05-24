import { Logger, LoggerService } from "@nestjs/common";

export class BaseLogger extends Logger implements LoggerService {}

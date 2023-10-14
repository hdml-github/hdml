/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { ModuleMetadata } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TerminusModule } from "@nestjs/terminus";
import { status } from "../controllers/api/v0/status";
import { Config } from "../services/Config";
import { Status } from "../services/Status";
import { Thread } from "../services/Thread";
import { getCliOpts } from "./getCliOpts";

const common = {
  imports: [
    ConfigModule.forRoot({
      envFilePath: [getCliOpts().envpath || ".env"],
      ignoreEnvFile: false,
      isGlobal: true,
      cache: true,
      load: [
        Config.Gateway,
        Config.Hideway,
        Config.Querier,
        Config.Engine,
        Config.Queue,
        Config.FileStruct,
        Config.JWE,
      ],
    }),
    TerminusModule,
  ],
  controllers: [status],
  providers: [Config, Status, Thread],
};

/**
 * Returns module metadata depends on specified CLI opts.
 */
export function getModuleMetadata(): ModuleMetadata {
  switch (getCliOpts().mode) {
    case "gateway":
      return { ...common };
    case "hideway":
      return { ...common };
    case "querier":
      return { ...common };
  }
}

/**
 * Returns module host depends on specified config and CLI opts.
 */
export function getModuleHost(conf: Config): string {
  switch (getCliOpts().mode) {
    case "gateway":
      return conf.gatewayHost;
    case "hideway":
      return conf.hidewayHost;
    case "querier":
      return conf.querierHost;
  }
}

/**
 * Returns module port depends on specified config and CLI opts.
 */
export function getModulePort(conf: Config): number {
  switch (getCliOpts().mode) {
    case "gateway":
      return conf.gatewayPort;
    case "hideway":
      return conf.hidewayPort;
    case "querier":
      return conf.querierPort;
  }
}

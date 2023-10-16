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
import { Stats } from "../services/Stats";
import { Status } from "../services/Status";
import { Thread } from "../services/Thread";
import { Workdir } from "../services/Workdir";
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
        Config.Workdir,
        Config.Engine,
        Config.Queue,
        Config.Stats,
        Config.JWE,
      ],
    }),
    TerminusModule,
  ],
  controllers: [status],
  providers: [Config, Stats, Status, Thread, Workdir],
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

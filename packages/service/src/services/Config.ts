/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Injectable } from "@nestjs/common";
import {
  ConfigFactoryKeyHost,
  ConfigService,
  registerAs,
} from "@nestjs/config";

/**
 * Gateway server configuration.
 */
type Gateway = {
  HOST: string;
  PORT: number;
};

/**
 * Hideway server configuration.
 */
type Hideway = {
  HOST: string;
  PORT: number;
};

/**
 * Querier server configuration.
 */
type Querier = {
  HOST: string;
  PORT: number;
};

/**
 * Engine server configuration.
 */
type Engine = {
  HOST: string;
  PORT: number;
};

/**
 * Queue server configuration.
 */
type Queue = {
  HOST: string;
  PORT: number;
  REST: number;
  TENANT: string;
  NAMESPACE: string;
  TTL: number;
};

/**
 * Service file structure configuration.
 */
type FileStruct = {
  PROJECT_PATH: string;
  HOOKS_PATH: string;
  KEYS_PATH: string;
  HDML_PATH: string;
  HDML_EXT: string;
  ENV_FILE: string;
  KEY_FILE: string;
  PUB_FILE: string;
};

/**
 * Service `JWE` tokens configuration.
 */
type JWE = {
  IMP: string;
  ALG: string;
  ENC: string;
  ISS: string;
  SUB: string;
  SES: string;
  TTL: number;
};

type ConfigSet =
  | Record<"Gateway", Gateway>
  | Record<"Hideway", Hideway>
  | Record<"Querier", Querier>
  | Record<"Engine", Engine>
  | Record<"Queue", Queue>
  | Record<"FileStruct", FileStruct>;

/**
 * Configuration service.
 */
@Injectable()
export class Config {
  /**
   * Gateway server config namespace.
   */
  public static get Gateway(): (() => Gateway) &
    ConfigFactoryKeyHost<Gateway> {
    return registerAs("Gateway", () => ({
      HOST: process.env.GATEWAY_HOST || "0.0.0.0",
      PORT: parseInt(process.env.GATEWAY_PORT || "8888"),
    }));
  }

  /**
   * Hideway server config namespace.
   */
  public static get Hideway(): (() => Hideway) &
    ConfigFactoryKeyHost<Hideway> {
    return registerAs("Hideway", () => ({
      HOST: process.env.HIDEWAY_HOST || "0.0.0.0",
      PORT: parseInt(process.env.HIDEWAY_PORT || "8887"),
    }));
  }

  /**
   * Querier server config namespace.
   */
  public static get Querier(): (() => Querier) &
    ConfigFactoryKeyHost<Querier> {
    return registerAs("Querier", () => ({
      HOST: process.env.QUERIER_HOST || "0.0.0.0",
      PORT: parseInt(process.env.QUERIER_PORT || "8886"),
    }));
  }

  /**
   * Engine server config namespace.
   */
  public static get Engine(): (() => Engine) &
    ConfigFactoryKeyHost<Engine> {
    return registerAs("Engine", () => ({
      HOST: process.env.ENGINE_HOST || "0.0.0.0",
      PORT: parseInt(process.env.ENGINE_PORT || "8080"),
    }));
  }

  /**
   * Queue server config namespace.
   */
  public static get Queue(): (() => Queue) &
    ConfigFactoryKeyHost<Queue> {
    return registerAs("Queue", () => ({
      HOST: process.env.QUEUE_HOST || "0.0.0.0",
      PORT: parseInt(process.env.QUEUE_PORT || "6650"),
      REST: parseInt(process.env.QUEUE_REST || "9090"),
      TENANT: process.env.QUEUE_TENANT || "public",
      NAMESPACE: process.env.QUEUE_NAMESPACE || "default",
      TTL: parseInt(process.env.QUEUE_TTL || "60"),
    }));
  }

  /**
   * File structure config namespace.
   */
  public static get FileStruct(): (() => FileStruct) &
    ConfigFactoryKeyHost<FileStruct> {
    return registerAs("FileStruct", () => ({
      PROJECT_PATH: process.env.FS_PROJECT_PATH || ".",
      HOOKS_PATH: process.env.FS_HOOKS_PATH || "hooks",
      KEYS_PATH: process.env.FS_KEYS_PATH || "keys",
      HDML_PATH: process.env.FS_HDML_PATH || "hdml",
      HDML_EXT: process.env.FS_HDML_EXT || "html",
      ENV_FILE: process.env.FS_ENV_FILE || ".env",
      KEY_FILE: process.env.FS_KEY_FILE || "key",
      PUB_FILE: process.env.FS_PUB_FILE || "key.pub",
    }));
  }

  /**
   * JWE tokens config namespace.
   */
  public static get JWE(): (() => JWE) & ConfigFactoryKeyHost<JWE> {
    return registerAs("JWE", () => ({
      IMP: process.env.JWE_IMP || "ES256",
      ALG: process.env.JWE_ALG || "RSA-OAEP-256",
      ENC: process.env.JWE_ENC || "A256GCM",
      ISS: process.env.JWE_ISS || "TokensSvc",
      SUB: process.env.JWE_SUB || "Access Token",
      SES: process.env.JWE_SES || "Session Token",
      TTL: parseInt(process.env.JWE_TTL || "86400"),
    }));
  }

  /**
   * Class constructor.
   */
  constructor(private _conf: ConfigService<ConfigSet, true>) {}

  /**
   * Gateway server host. Can be configured via the `GATEWAY_HOST`
   * environment variable.
   */
  public get gatewayHost(): string {
    return this._conf.get<Gateway>("Gateway").HOST;
  }

  /**
   * Gateway server port. Can be configured via the `GATEWAY_PORT`
   * environment variable.
   */
  public get gatewayPort(): number {
    return this._conf.get<Gateway>("Gateway").PORT;
  }

  /**
   * Hideway server host. Can be configured via the `HIDEWAY_HOST`
   * environment variable.
   */
  public get hidewayHost(): string {
    return this._conf.get<Hideway>("Hideway").HOST;
  }

  /**
   * Hideway server port. Can be configured via the `HIDEWAY_PORT`
   * environment variable.
   */
  public get hidewayPort(): number {
    return this._conf.get<Hideway>("Hideway").PORT;
  }

  /**
   * Querier server host. Can be configured via the `QUERIER_HOST`
   * environment variable.
   */
  public get querierHost(): string {
    return this._conf.get<Querier>("Querier").HOST;
  }

  /**
   * Querier server host. Can be configured via the `QUERIER_PORT`
   * environment variable.
   */
  public get querierPort(): number {
    return this._conf.get<Querier>("Querier").PORT;
  }

  /**
   * Engine server host. Can be configured via the `ENGINE_HOST`
   * environment variable.
   */
  public get engineHost(): string {
    return this._conf.get<Engine>("Engine").HOST;
  }

  /**
   * Engine server port. Can be configured via the `ENGINE_PORT`
   * environment variable.
   */
  public get enginePort(): number {
    return this._conf.get<Engine>("Engine").PORT;
  }

  /**
   * Queue server host. Can be configured via the `QUEUE_HOST`
   * environment variable.
   */
  public get queueHost(): string {
    return this._conf.get<Queue>("Queue").HOST;
  }

  /**
   * Queue server port. Can be configured via the `QUEUE_PORT`
   * environment variable.
   */
  public get queuePort(): number {
    return this._conf.get<Queue>("Queue").PORT;
  }

  /**
   * Queue server REST API port. Can be configured via the
   * `QUEUE_REST` environment variable.
   */
  public get queueRest(): number {
    return this._conf.get<Queue>("Queue").REST;
  }

  /**
   * Queue server tenant to use. Can be configured via the
   * `QUEUE_TENANT` environment variable.
   */
  public get queueTenant(): string {
    return this._conf.get<Queue>("Queue").TENANT;
  }

  /**
   * Queue server namespace to use. Can be configured via the
   * `QUEUE_NAMESPACE` environment variable.
   */
  public get queueNamespace(): string {
    return this._conf.get<Queue>("Queue").NAMESPACE;
  }

  /**
   * Queue server data message TTL in seconds (cache). Can be
   * configured via the `QUEUE_TTL` environment variable.
   */
  public get queueTtl(): number {
    return this._conf.get<Queue>("Queue").TTL;
  }

  /**
   * Service project path. Can be configured via the `FS_PROJECT_PATH`
   * environment variable.
   */
  public get fsProjectPath(): string {
    return this._conf.get<FileStruct>("FileStruct").PROJECT_PATH;
  }

  /**
   * Tenants hooks path. Can be configured via the `FS_HOOKS_PATH`
   * environment variable.
   */
  public get fsHooksPath(): string {
    return this._conf.get<FileStruct>("FileStruct").HOOKS_PATH;
  }

  /**
   * Tenants encription keys path. Can be configured via the
   * `FS_KEYS_PATH` environment variable.
   */
  public get fsKeysPath(): string {
    return this._conf.get<FileStruct>("FileStruct").KEYS_PATH;
  }

  /**
   * Tenants `hdml` documents path. Can be configured via the
   * `FS_HDML_PATH` environment variable.
   */
  public get fsHdmlPath(): string {
    return this._conf.get<FileStruct>("FileStruct").HDML_PATH;
  }

  /**
   * Tenants `hdml` document file extension. Can be configured via the
   * `FS_HDML_EXT` environment variable.
   */
  public get fsHdmlExt(): string {
    return this._conf.get<FileStruct>("FileStruct").HDML_EXT;
  }

  /**
   * Tenants environment file name. Can be configured via the
   * `FS_ENV_FILE` environment variable.
   */
  public get fsEnvFile(): string {
    return this._conf.get<FileStruct>("FileStruct").ENV_FILE;
  }

  /**
   * Tenants private key file name. Can be configured via the
   * `FS_KEY_FILE` environment variable.
   */
  public get fsKeyFile(): string {
    return this._conf.get<FileStruct>("FileStruct").KEY_FILE;
  }

  /**
   * Tenants public key file name. Can be configured via the
   * `FS_PUB_FILE` environment variable.
   */
  public get fsPubFile(): string {
    return this._conf.get<FileStruct>("FileStruct").PUB_FILE;
  }

  /**
   * Imported keys encryption algorythm. Can be configured via the
   * `JWE_IMP` environment variable.
   */
  public get jweImp(): string {
    return this._conf.get<JWE>("JWE").IMP;
  }

  /**
   * Token encryption algorythm. Can be configured via the `JWE_ALG`
   * environment variable.
   */
  public get jweAlg(): string {
    return this._conf.get<JWE>("JWE").ALG;
  }

  /**
   * Token encryption. Can be configured via the `JWE_ENC` environment
   * variable.
   */
  public get jweEnc(): string {
    return this._conf.get<JWE>("JWE").ENC;
  }

  /**
   * Token issuer claim. Can be configured via the `JWE_ISS`
   * environment variable.
   */
  public get jweIss(): string {
    return this._conf.get<JWE>("JWE").ISS;
  }

  /**
   * Access token subject claim. Can be configured via the `JWE_SUB`
   * environment variable.
   */
  public get jweSub(): string {
    return this._conf.get<JWE>("JWE").SUB;
  }

  /**
   * Session token subject claim. Can be configured via the `JWE_SES`
   * environment variable.
   */
  public get jweSes(): string {
    return this._conf.get<JWE>("JWE").SES;
  }

  /**
   * Session token TTL in seconds. Can be configured via the `JWE_TTL`
   * environment variable.
   */
  public get jweTtl(): number {
    return this._conf.get<JWE>("JWE").TTL;
  }
}

import { Dir, stat, opendir, readdir, readFile } from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { KeyLike } from "jose";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ModelData, FrameData } from "@hdml/schema";
import { IoJson } from "@hdml/elements";
import { Options } from "./Options";
import { Tokens } from "./Tokens";
import { Compiler } from "./Compiler";

/**
 * List of the standard environment variables keys.
 */
export type EnvKey = "HDML_TENANT_NAME";

/**
 * Environment variables table.
 */
export type EnvTable = {
  [key in EnvKey]: string;
};

/**
 * Tenant files data.
 */
export type TenantFiles = {
  env: EnvTable;
  key: KeyLike;
  pub: KeyLike;
  docs: {
    [path: string]: {
      model?: ModelData;
      frame?: FrameData;
    };
  };
};

/**
 * Files system service.
 */
@Injectable()
export class Filer implements OnModuleInit {
  /**
   * Service logger.
   */
  private readonly _logger = new Logger(Filer.name, {
    timestamp: true,
  });

  /**
   * `@hdml/elements` bundle content.
   */
  private _script: null | string = null;

  /**
   * Tenants files map.
   */
  private _tenants: Map<string, TenantFiles> = new Map();

  /**
   * Class constructor.
   */
  constructor(
    private readonly _options: Options,
    private readonly _tokens: Tokens,
    private readonly _compiler: Compiler,
  ) {}

  /**
   * Module initialized callback.
   */
  public onModuleInit(): void {
    this._logger.log("Running compilation workflow");
    this.runWorkflow().catch((reason) => {
      this._logger.error(reason);
    });
  }

  /**
   * Returns an array of available tenants.
   */
  public getTenantsList(): string[] {
    return Array.from(this._tenants.keys());
  }

  /**
   * Returns environments table of the specified `tenant` if exists,
   * or `null` otherwise.
   */
  public getEnvTable(tenant: string): null | EnvTable {
    if (this._tenants.has(tenant)) {
      return (<TenantFiles>this._tenants.get(tenant)).env;
    } else {
      return null;
    }
  }

  /**
   * Returns public key of the specified `tenant` if exists, or `null`
   * otherwise.
   */
  public getPublicKey(tenant: string): null | KeyLike {
    if (this._tenants.has(tenant)) {
      return (<TenantFiles>this._tenants.get(tenant)).pub;
    } else {
      return null;
    }
  }

  /**
   * Returns private key of the specified `tenant` if exists, or
   * `null` otherwise.
   */
  public getPrivateKey(tenant: string): null | KeyLike {
    if (this._tenants.has(tenant)) {
      return (<TenantFiles>this._tenants.get(tenant)).key;
    } else {
      return null;
    }
  }

  /**
   * Returns `hdml` document for the specified `tenant` by the
   * specified `uri`, or `null` otherwise.
   */
  public getHdmlDocument(
    tenant: string,
    uri: string,
  ): null | {
    model?: ModelData;
    frame?: FrameData;
  } {
    if (this._tenants.has(tenant)) {
      const doc = (<TenantFiles>this._tenants.get(tenant)).docs[uri];
      return doc || null;
    } else {
      return null;
    }
  }

  /**
   * Runs async workflow.
   */
  private async runWorkflow(): Promise<void> {
    this._script = await this.loadFile(
      path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "node_modules",
        "@hdml",
        "elements",
        "bin",
        "elements.min.js",
      ),
    );
    await this._compiler.bootstrap(this._script);
    await this.loadTenants();
    this._logger.log("Tenants initialized");
  }

  /**
   * Returns tenants map.
   */
  private async loadTenants(): Promise<void> {
    const project = await new Promise<Dir>((resolve, reject) => {
      opendir(this._options.getProjectPath(), (err, dir) => {
        if (err) {
          reject(err);
        } else {
          resolve(dir);
        }
      });
    });
    for await (const dirent of project) {
      if (dirent.isDirectory() && dirent.name.indexOf(".") !== 0) {
        const tenant = dirent.name;
        const env = dotenv.parse<EnvTable>(
          await this.loadEnv(tenant),
        );
        const key = await this.loadKey(tenant);
        const pub = await this.loadPub(tenant);
        const docs = this._compiler.complete(
          await this.loadFragments(tenant),
        );
        this._tenants.set(tenant, {
          env,
          key,
          pub,
          docs,
        });
      }
    }
  }

  /**
   * Returns the tenant `.env` file content.
   */
  private async loadEnv(tenant: string): Promise<string> {
    const file = path.resolve(
      this._options.getProjectPath(),
      tenant,
      this._options.getTenantEnvName(),
    );
    return this.loadFile(file);
  }

  /**
   * Loads private key from a disk and returns `KeyLike` object.
   */
  private async loadKey(tenant: string): Promise<KeyLike> {
    const file = path.resolve(
      this._options.getProjectPath(),
      tenant,
      this._options.getTenantKeysPath(),
      this._options.getTenantPrivateKeyName(),
    );
    return await this._tokens.getPrivateKey(
      await this.loadFile(file),
    );
  }

  /**
   * Loads public key from a disk and returns `KeyLike` object.
   */
  private async loadPub(tenant: string): Promise<KeyLike> {
    const file = path.resolve(
      this._options.getProjectPath(),
      tenant,
      this._options.getTenantKeysPath(),
      this._options.getTenantPublicKeyName(),
    );
    return this._tokens.getPublicKey(await this.loadFile(file));
  }

  /**
   * Load tenant `hdml` fragments hash map object.
   */
  private async loadFragments(
    tenant: string,
  ): Promise<{ [dir: string]: IoJson }> {
    const root = path.resolve(
      this._options.getProjectPath(),
      tenant,
      this._options.getTenantDocumentsPath(),
    );
    const files = (await this.getFilesList(root)).filter(
      (file) =>
        file.indexOf(`.${this._options.getTenantDocumentsExt()}`) > 0,
    );
    const hdmls = await this.loadHdmls(
      tenant,
      this._options.getTenantDocumentsPath(),
      files,
    );
    return hdmls;
  }

  /**
   * Loads `hdml` files recursively starting from the specified `dir`.
   * Returns a hash map with the keys equal to a file path and value
   * equal to a file content.
   */
  private async loadHdmls(
    tenant: string,
    directory: string,
    files: string[],
  ): Promise<{ [dir: string]: IoJson }> {
    const docs: { [dir: string]: IoJson } = {};
    const promises = files.map((file) => {
      return new Promise<IoJson>((resolve, reject) => {
        readFile(file, { encoding: "utf8" }, (err, hdml) => {
          if (err) {
            reject(err);
          } else {
            this._compiler.compile(hdml).then(resolve).catch(reject);
          }
        });
      });
    });
    const datas = await Promise.all<IoJson>(promises);
    files.forEach((file, i) => {
      const key = file.split(
        path.resolve(
          this._options.getProjectPath(),
          tenant,
          directory,
        ),
      )[1];
      docs[key] = datas[i];
    });
    return docs;
  }

  /**
   * Loads file from disk and returns its content.
   */
  private async loadFile(file: string): Promise<string> {
    if (!(await this.isFileExist(file))) {
      throw new Error(`The ${file} file is not readable.`);
    } else {
      return new Promise((resolve, reject) => {
        readFile(file, { encoding: "utf8" }, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }
  }

  /**
   * Recursive find all files in specified `directory`.
   */
  public async getFilesList(directory: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      readdir(directory, (err, paths) => {
        if (err) {
          reject(err);
        } else {
          let files: string[] = [];
          const promises: Promise<string[]>[] = paths.map(
            async (_path) => {
              _path = path.resolve(directory, _path);
              if (await this.isDirExist(_path)) {
                return await this.getFilesList(_path);
              } else if (await this.isFileExist(_path)) {
                return [_path];
              } else {
                throw new Error(`Invalid path type: ${_path}`);
              }
            },
          );
          Promise.all(promises)
            .then((pathsArray) => {
              files = files.concat(...pathsArray);
              resolve(files);
            })
            .catch((reason) => {
              reject(reason);
            });
        }
      });
    });
  }

  /**
   * Determine is specified `directory` exist or not.
   */
  public async isDirExist(directory: string): Promise<boolean> {
    return new Promise((resolve) => {
      stat(directory, (err, stats) => {
        if (err) {
          resolve(false);
        } else {
          resolve(stats.isDirectory());
        }
      });
    });
  }

  /**
   * Determine is specified `file` exist or not.
   */
  public async isFileExist(file: string): Promise<boolean> {
    return new Promise((resolve) => {
      stat(file, (err, stats) => {
        if (err) {
          resolve(false);
        } else {
          resolve(stats.isFile());
        }
      });
    });
  }
}

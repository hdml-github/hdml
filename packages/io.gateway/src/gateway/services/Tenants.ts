/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Dir, stat, opendir, readdir, readFile } from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { KeyLike } from "jose";
import { NodeVM, VMScript } from "vm2";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ModelDef, FrameDef, QueryDef } from "@hdml/schema";
import { FragmentDef } from "@hdml/elements";
import { Options } from "./Options";
import { Tokens } from "./Tokens";
import { HookFn, Compiler } from "./Compiler";

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
export type TenantFile = {
  env: EnvTable;
  key: KeyLike;
  pub: KeyLike;
  hook: HookFn;
  defs: {
    [path: string]: {
      model?: ModelDef;
      frame?: FrameDef;
    };
  };
};

/**
 * Files system service.
 */
@Injectable()
export class Tenants implements OnModuleInit {
  /**
   * Service logger.
   */
  private readonly _logger = new Logger(Tenants.name, {
    timestamp: true,
  });

  /**
   * `@hdml/elements` bundle content.
   */
  private _script: null | string = null;

  /**
   * Tenants files map.
   */
  private _tenants: Map<string, TenantFile> = new Map();

  /**
   * Class constructor.
   */
  public constructor(
    private readonly _options: Options,
    private readonly _tokens: Tokens,
    private readonly _compiler: Compiler,
  ) {}

  /**
   * Module initialized callback.
   */
  public onModuleInit(): void {
    this._logger.log("Running filer service");
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
      return (<TenantFile>this._tenants.get(tenant)).env;
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
      return (<TenantFile>this._tenants.get(tenant)).pub;
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
      return (<TenantFile>this._tenants.get(tenant)).key;
    } else {
      return null;
    }
  }

  /**
   * Returns tenant file if exists, or `null` otherwise.
   */
  public getTenantFile(tenant: string): null | TenantFile {
    if (this._tenants.has(tenant)) {
      return <TenantFile>this._tenants.get(tenant);
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
      opendir(this._options.getWorkdir(), (err, dir) => {
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
        const hook = await this.loadHook(tenant);
        const defs = this.completeDefs(
          await this.loadFragmentsDefs(tenant),
        );
        this._tenants.set(tenant, {
          env,
          key,
          pub,
          hook,
          defs,
        });
      }
    }
  }

  /**
   * Returns the tenant `.env` file content.
   */
  private async loadEnv(tenant: string): Promise<string> {
    const file = path.resolve(
      this._options.getWorkdir(),
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
      this._options.getWorkdir(),
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
      this._options.getWorkdir(),
      tenant,
      this._options.getTenantKeysPath(),
      this._options.getTenantPublicKeyName(),
    );
    return this._tokens.getPublicKey(await this.loadFile(file));
  }

  /**
   * Loads hook function.
   */
  private async loadHook(tenant: string): Promise<HookFn> {
    const hookPath = path.resolve(
      this._options.getWorkdir(),
      tenant,
      this._options.getTenantHookPath(),
    );
    const hookFile = path.resolve(hookPath, "index.js");
    const hookContent = await this.loadFile(hookFile);
    const hookScript = new VMScript(hookContent, {
      filename: hookFile,
    });
    const vm = new NodeVM({
      console: "inherit",
      sandbox: {},
      eval: false,
      wasm: false,
      sourceExtensions: ["js"],
      require: {
        external: true,
        builtin: ["*"],
        context: "sandbox",
      },
      argv: [],
      env: {},
      strict: true,
    });
    const hook = <HookFn>vm.run(hookScript, hookFile);
    return hook;
  }

  /**
   * Loads the tenant `html` fragments and returns the hash map of
   * their elements definitions.
   */
  private async loadFragmentsDefs(
    tenant: string,
  ): Promise<{ [dir: string]: FragmentDef }> {
    const root = path.resolve(
      this._options.getWorkdir(),
      tenant,
      this._options.getTenantDocumentsPath(),
    );
    const files = (await this.getFilesList(root)).filter(
      (file) =>
        file.indexOf(`.${this._options.getTenantDocumentsExt()}`) > 0,
    );
    const defs = await this.loadFilesDefs(
      tenant,
      this._options.getTenantDocumentsPath(),
      files,
    );
    return defs;
  }

  /**
   * Loads specified `files`, compiles them to the `FragmentDef` and
   * returns a hash map with the keys equal to the file path and the
   * value equal to the file `FragmentDef`.
   */
  private async loadFilesDefs(
    tenant: string,
    root: string,
    files: string[],
  ): Promise<{ [dir: string]: FragmentDef }> {
    const defs: { [dir: string]: FragmentDef } = {};
    const promises = files.map((file) => {
      return new Promise<FragmentDef>((resolve, reject) => {
        readFile(file, { encoding: "utf8" }, (err, hdml) => {
          if (err) {
            reject(err);
          } else {
            this._compiler.compile(hdml).then(resolve).catch(reject);
          }
        });
      });
    });
    const datas = await Promise.all<FragmentDef>(promises);
    files.forEach((file, i) => {
      const key = file.split(
        path.resolve(this._options.getWorkdir(), tenant, root),
      )[1];
      defs[key] = datas[i];
    });
    return defs;
  }

  /**
   * Loads file from the disk and returns its content.
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
   * Recursively finds all files in the specified `directory`.
   */
  private async getFilesList(directory: string): Promise<string[]> {
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
   * Determines is specified `directory` exist or not.
   */
  private async isDirExist(directory: string): Promise<boolean> {
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
   * Determines is specified `file` exist or not.
   */
  private async isFileExist(file: string): Promise<boolean> {
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

  /**
   * Completes the `html` fragments definitions by resolving the
   * `source` attributes of the `FrameElement` elements.
   */
  private completeDefs(defs: { [path: string]: FragmentDef }): {
    [path: string]: QueryDef;
  } {
    const completed: {
      [path: string]: QueryDef;
    } = {};
    Object.keys(defs).forEach((path: string) => {
      const fragment = defs[path];
      const models = Object.keys(fragment.models);
      const frames = Object.keys(fragment.frames);
      if (models.length) {
        models.forEach((name) => {
          completed[`${path}?hdml-model=${name}`] = {
            model: fragment.models[name],
          };
        });
      }
      if (frames.length) {
        frames.forEach((name) => {
          const uri = `${path}?hdml-frame=${name}`;
          const frame = fragment.frames[name];
          const source = frame.source;
          completed[uri] = {
            model: this.lookupModel(defs, path, source),
            frame: frame,
          };
          if (source.indexOf("/") === 0) {
            if (source.indexOf("?hdml-frame=") > 0) {
              const [path, name] = source.split("?hdml-frame=");
              const parent = defs[path]?.frames[name];
              (<FrameDef>completed[uri].frame).parent = parent;
            }
          }
        });
      }
    });
    return completed;
  }

  /**
   * Searchs a `model` for the specified `current` path and the
   * specified `fragment`.
   */
  private lookupModel(
    defs: { [path: string]: FragmentDef },
    current: string,
    source: string,
  ): ModelDef {
    let cnt = 0;
    let src: null | string = source;
    let curr = current;
    while (src && cnt < 100) {
      cnt++;
      this.assertSource(defs, curr, src);
      const index = src.indexOf("?hdml-frame=");
      if (index >= 0) {
        const [path, name]: string[] = src.split("?hdml-frame=");
        const uri: string = index === 0 ? curr : path;
        src = defs[uri]?.frames[name]?.source;
        curr = uri;
      } else {
        const [path, name] = src.split("?hdml-model=");
        const uri: string = path.length === 0 ? curr : path;
        return defs[uri]?.models[name];
      }
    }
    throw new Error(
      `Lookup model failed for \`${current}\` source \`${source}\``,
    );
  }

  /**
   * Asserts `source` value for the specified `current` path and the
   * specified `fragments`.
   */
  private assertSource(
    defs: { [path: string]: FragmentDef },
    current: string,
    source: string,
  ): void {
    const modelIndex = source.indexOf("?hdml-model=");
    const frameIndex = source.indexOf("?hdml-frame=");
    if (modelIndex === -1 && frameIndex === -1) {
      throw new Error(`Invalid \`source\` value: ${source}`);
    }
    if (modelIndex > -1 && frameIndex > -1) {
      throw new Error(`Invalid \`source\` value: ${source}`);
    }
    if (modelIndex === 0) {
      const [, name] = source.split("?hdml-model=");
      if (!defs[current]?.models[name]) {
        throw new Error(`Specified \`model\` is missing: ${source}`);
      }
    }
    if (modelIndex > 0) {
      const [path, name] = source.split("?hdml-model=");
      if (!defs[path]?.models[name]) {
        throw new Error(`Specified \`model\` is missing: ${source}`);
      }
    }
    if (frameIndex === 0) {
      const [, name] = source.split("?hdml-frame=");
      if (!defs[current]?.frames[name]) {
        throw new Error(`Specified \`frame\` is missing: ${source}`);
      }
    }
    if (frameIndex > 0) {
      const [path, name] = source.split("?hdml-frame=");
      if (!defs[path]?.frames[name]) {
        throw new Error(`Specified \`frame\` is missing: ${source}`);
      }
    }
  }
}

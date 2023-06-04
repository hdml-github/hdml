import { Dir, stat, opendir, readdir, readFile } from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { KeyLike } from "jose";
import { NodeVM, VMScript } from "vm2";
import {
  Injectable,
  Logger,
  OnModuleInit,
  HttpException,
  HttpStatus,
  StreamableFile,
} from "@nestjs/common";
import { ModelData, FrameData, Document } from "@hdml/schema";
import { getHTML } from "@hdml/orchestrator";
import { ElementsData } from "@hdml/elements";
import { Options } from "./Options";
import { Tokens } from "./Tokens";
import { HookFn, Compiler } from "./Compiler";
import { GatewayQueue } from "./GatewayQueue";

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
  hook: HookFn;
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
  public constructor(
    private readonly _options: Options,
    private readonly _tokens: Tokens,
    private readonly _compiler: Compiler,
    private readonly _queue: GatewayQueue,
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
   * Posts specified `hdml` `document` and returns its unique
   * identifier.
   * @throws
   */
  public async postHdmlDocument(
    tenant: string,
    context: object,
    document: Document,
  ): Promise<StreamableFile> {
    if (this._tenants.has(tenant)) {
      const hook = <HookFn>this._tenants.get(tenant)?.hook;
      const html = this.getHtmlDocument(tenant, document);
      const hdml = await this._compiler.getHdmlDocument(
        html,
        hook,
        context,
      );
      if (hdml) {
        try {
          return this._queue.postHdmlDocument(hdml);
        } catch (error) {
          const message = (<Error>error).message;
          throw new HttpException(
            message,
            HttpStatus.FAILED_DEPENDENCY,
          );
        }
      } else {
        throw new HttpException(
          `HdmlDocument was not completed`,
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(
        `Tenant files are missed: ${tenant}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Returns document's `file` stream.
   */
  public async getHdmlDocumentFile(
    file: string,
  ): Promise<StreamableFile> {
    return this._queue.getHdmlDocumentFile(file);
  }

  /**
   * Returns complete queried `html` document for the specified
   * `tenant`.
   */
  public getHtmlDocument(tenant: string, document: Document): string {
    return getHTML(this.getHdmlDocument(tenant, document));
  }

  /**
   * Returns complete queried `hdml` document for the specified
   * `tenant`.
   */
  public getHdmlDocument(
    tenant: string,
    document: Document,
  ): Document {
    if (!this.isValidDocument(document)) {
      throw new HttpException(
        "Invalid document",
        HttpStatus.BAD_REQUEST,
      );
    }
    if (this.isCompleteDocument(document)) {
      return document;
    } else {
      const frame = <FrameData>document.frame;
      let parent = frame;
      while (parent.parent) parent = parent.parent;
      const data = this.getHdmlDocumentData(tenant, parent.source);
      if (!data) {
        throw new HttpException(
          `DocumentData is missing: ${parent.source}`,
          HttpStatus.NOT_FOUND,
        );
      }
      if (!data.model) {
        throw new HttpException(
          `Document model is missing: ${parent.source}`,
          HttpStatus.NOT_FOUND,
        );
      }
      parent.parent = data.frame;
      return new Document({
        name: "",
        tenant: "",
        token: "",
        model: data.model,
        frame,
      });
    }
  }

  /**
   * Returns `hdml` document for the specified `tenant` by the
   * specified `uri`, or `null` otherwise.
   */
  public getHdmlDocumentData(
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
        const hook = await this.loadHook(tenant);
        const docs = this.completeDocs(
          await this.loadFragments(tenant),
        );
        this._tenants.set(tenant, {
          env,
          key,
          pub,
          hook,
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
   * Loads hook function.
   */
  private async loadHook(tenant: string): Promise<HookFn> {
    const hookPath = path.resolve(
      this._options.getProjectPath(),
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
   * Load tenant `hdml` fragments hash map object.
   */
  private async loadFragments(
    tenant: string,
  ): Promise<{ [dir: string]: ElementsData }> {
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
  ): Promise<{ [dir: string]: ElementsData }> {
    const docs: { [dir: string]: ElementsData } = {};
    const promises = files.map((file) => {
      return new Promise<ElementsData>((resolve, reject) => {
        readFile(file, { encoding: "utf8" }, (err, hdml) => {
          if (err) {
            reject(err);
          } else {
            this._compiler.compile(hdml).then(resolve).catch(reject);
          }
        });
      });
    });
    const datas = await Promise.all<ElementsData>(promises);
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
   * Determine is specified `directory` exist or not.
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
   * Determine is specified `file` exist or not.
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
   * Completes fragments to a document's state.
   */
  private completeDocs(fragments: { [path: string]: ElementsData }): {
    [path: string]: {
      model?: ModelData;
      frame?: FrameData;
    };
  } {
    const documents: {
      [path: string]: {
        model?: ModelData;
        frame?: FrameData;
      };
    } = {};
    Object.keys(fragments).forEach((path: string) => {
      const fragment = fragments[path];
      const models = Object.keys(fragment.models);
      const frames = Object.keys(fragment.frames);
      if (models.length) {
        models.forEach((name) => {
          documents[`${path}?hdml-model=${name}`] = {
            model: fragment.models[name],
          };
        });
      }
      if (frames.length) {
        frames.forEach((name) => {
          const uri = `${path}?hdml-frame=${name}`;
          const frame = fragment.frames[name];
          const source = frame.source;
          documents[uri] = {
            model: this.lookupModel(fragments, path, source),
            frame: frame,
          };
          if (source.indexOf("/") === 0) {
            if (source.indexOf("?hdml-frame=") > 0) {
              const [path, name] = source.split("?hdml-frame=");
              const parent = fragments[path]?.frames[name];
              (<FrameData>documents[uri].frame).parent = parent;
            }
          }
        });
      }
    });
    return documents;
  }

  /**
   * Searchs a `model` for the specified `current` path and the
   * specified `fragment`.
   */
  private lookupModel(
    fragments: { [path: string]: ElementsData },
    current: string,
    source: string,
  ): ModelData {
    let cnt = 0;
    let src: null | string = source;
    let curr = current;
    while (src && cnt < this._options.getCompilerFramesDepth()) {
      cnt++;
      this.assertSource(fragments, curr, src);
      const index = src.indexOf("?hdml-frame=");
      if (index >= 0) {
        const [path, name]: string[] = src.split("?hdml-frame=");
        const uri: string = index === 0 ? curr : path;
        src = fragments[uri]?.frames[name]?.source;
        curr = uri;
      } else {
        const [path, name] = src.split("?hdml-model=");
        const uri: string = path.length === 0 ? curr : path;
        return fragments[uri]?.models[name];
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
    fragments: { [path: string]: ElementsData },
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
      if (!fragments[current]?.models[name]) {
        throw new Error(`Specified \`model\` is missing: ${source}`);
      }
    }
    if (modelIndex > 0) {
      const [path, name] = source.split("?hdml-model=");
      if (!fragments[path]?.models[name]) {
        throw new Error(`Specified \`model\` is missing: ${source}`);
      }
    }
    if (frameIndex === 0) {
      const [, name] = source.split("?hdml-frame=");
      if (!fragments[current]?.frames[name]) {
        throw new Error(`Specified \`frame\` is missing: ${source}`);
      }
    }
    if (frameIndex > 0) {
      const [path, name] = source.split("?hdml-frame=");
      if (!fragments[path]?.frames[name]) {
        throw new Error(`Specified \`frame\` is missing: ${source}`);
      }
    }
  }

  /**
   * Determine whether specified `document` is valid or not.
   */
  private isValidDocument(document: Document): boolean {
    return !!document.model || !!document.frame;
  }

  /**
   * Determine whether specified `document` is complete or not.
   */
  private isCompleteDocument(document: Document): boolean {
    return !!document.model;
  }
}

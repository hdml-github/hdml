import {
  statSync,
  opendirSync,
  readdirSync,
  readFileSync,
  readFile,
} from "fs";
import * as path from "path";
import { KeyLike, importSPKI, importPKCS8 } from "jose";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { ModelData, FrameData } from "@hdml/schema";
import { IoJson } from "@hdml/elements";
import { OptionsService } from "../options/OptionsService";
import { CompilerService } from "../compiler/CompilerService";

type Tenant = {
  env: string;
  key: KeyLike;
  pub: KeyLike;
  fragments: {
    [path: string]: IoJson;
  };
  documents: {
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
export class FilerService implements OnModuleInit {
  /**
   * `@hdml/elements` bundle content.
   */
  private _script: null | string = null;

  /**
   * Tenants data.
   */
  private _tenants: Map<string, Tenant> = new Map();

  /**
   * Class constructor.
   */
  constructor(
    private readonly options: OptionsService,
    private readonly compiler: CompilerService,
  ) {}

  /**
   * Module initialized callback.
   */
  public onModuleInit(): void {
    this.runWorkflow().catch((reason: string) => {
      console.error(reason);
    });
  }

  /**
   * Runs async workflow.
   */
  public async runWorkflow(): Promise<void> {
    this._script = await this.loadFile(
      path.resolve(
        __dirname,
        "..",
        "..",
        "node_modules",
        "@hdml",
        "elements",
        "bin",
        "elements.min.js",
      ),
    );
    await this.compiler.bootstrap(this._script);
    await this.loadTenants();
  }

  /**
   * Returns tenants list.
   */
  public async loadTenants(): Promise<void> {
    const project = opendirSync(this.options.getProjectPath());
    for await (const dirent of project) {
      if (dirent.isDirectory() && dirent.name.indexOf(".") !== 0) {
        const tenant = dirent.name;
        const env = await this.loadEnv(tenant);
        const key = await this.loadKey(tenant);
        const pub = await this.loadPub(tenant);
        const fragments = await this.loadFragments(tenant);
        const documents = this.compiler.complete(fragments);
        console.log(tenant, documents);
        this._tenants.set(tenant, {
          env,
          key,
          pub,
          fragments,
          documents,
        });
      }
    }
  }

  /**
   * Returns the tenant `.env` file content.
   */
  public async loadEnv(tenant: string): Promise<string> {
    const file = path.resolve(
      this.options.getProjectPath(),
      tenant,
      this.options.getTenantEnvName(),
    );
    return this.loadFile(file);
  }

  /**
   * Loads private key from a disk and returns `KeyLike` object.
   */
  public async loadKey(tenant: string): Promise<KeyLike> {
    const file = path.resolve(
      this.options.getProjectPath(),
      tenant,
      this.options.getTenantKeysPath(),
      this.options.getTenantPrivateKeyName(),
    );
    const content = await this.loadFile(file);
    const key = await importPKCS8(
      content,
      this.options.getKeysImportAlg(),
    );
    return key;
  }

  /**
   * Loads public key from a disk and returns `KeyLike` object.
   */
  public async loadPub(tenant: string): Promise<KeyLike> {
    const file = path.resolve(
      this.options.getProjectPath(),
      tenant,
      this.options.getTenantKeysPath(),
      this.options.getTenantPublicKeyName(),
    );
    const content = await this.loadFile(file);
    const key = await importSPKI(
      content,
      this.options.getKeysImportAlg(),
    );
    return key;
  }

  /**
   * Load tenant `hdml` fragments hash map object.
   */
  public async loadFragments(
    tenant: string,
  ): Promise<{ [dir: string]: IoJson }> {
    const root = path.resolve(
      this.options.getProjectPath(),
      tenant,
      this.options.getTenantDocumentsPath(),
    );
    const files = this.getFilesList(root).filter(
      (file) =>
        file.indexOf(`.${this.options.getTenantDocumentsExt()}`) > 0,
    );
    const hdmls = await this.loadHdmls(
      tenant,
      this.options.getTenantDocumentsPath(),
      files,
    );
    return hdmls;
  }

  /**
   * Loads `hdml` files recursively starting from the specified `dir`.
   * Returns a hash map with the keys equal to a file path and value
   * equal to a file content.
   */
  public async loadHdmls(
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
            this.compiler.compile(hdml).then(resolve).catch(reject);
          }
        });
      });
    });
    const datas = await Promise.all<IoJson>(promises);
    files.forEach((file, i) => {
      const key = file.split(
        path.resolve(
          this.options.getProjectPath(),
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
    if (!this.isFileExist(file)) {
      throw new Error(`The ${file} file is not readable.`);
    } else {
      const content = readFileSync(file, "utf8");
      return Promise.resolve(content);
    }
  }

  /**
   * Recursive find all files in specified path.
   */
  public getFilesList(dirName: string): string[] {
    let files: string[] = [];
    const list = readdirSync(dirName);
    list.forEach((item) => {
      item = path.resolve(dirName, item);
      if (this.isDirExist(item)) {
        files = files.concat(this.getFilesList(item));
      } else if (this.isFileExist(item)) {
        files.push(item);
      }
    });
    return files;
  }

  /**
   * Determine is specified directory exist or not.
   */
  public isDirExist(dirName: string): boolean {
    let exist;
    try {
      exist = statSync(dirName).isDirectory();
    } catch (err) {
      exist = false;
    }
    return exist;
  }

  /**
   * Determine is specified file exist or not.
   */
  public isFileExist(fileName: string): boolean {
    let exist;
    try {
      exist = statSync(fileName).isFile();
    } catch (err) {
      exist = false;
    }
    return exist;
  }
}

import { opendirSync, accessSync, readFileSync, constants } from "fs";
import * as path from "path";
import { KeyLike, importSPKI, importPKCS8 } from "jose";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { OptionsService } from "../options/OptionsService";

type Tenant = {
  env: string;
  key: KeyLike;
  pub: KeyLike;
  docs: {
    [dir: string]: string;
  };
};

/**
 * Files system service.
 */
@Injectable()
export class FilerService implements OnModuleInit {
  /**
   * Tenants data.
   */
  private _tenants: Map<string, Tenant> = new Map();

  /**
   * Class constructor.
   */
  constructor(private readonly options: OptionsService) {}

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
    await this.loadTenants();
    console.log(this._tenants);
  }

  /**
   * Returns tenants list.
   */
  public async loadTenants(): Promise<void> {
    const project = opendirSync(this.options.getProjectPath());
    for await (const dirent of project) {
      if (dirent.isDirectory() && dirent.name.indexOf(".") !== 0) {
        const env = await this.loadEnv(dirent.name);
        const key = await this.loadKey(dirent.name);
        const pub = await this.loadPub(dirent.name);
        const docs = await this.loadDocs(dirent.name);
        this._tenants.set(dirent.name, {
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

  public async loadDocs(
    tenant: string,
  ): Promise<{ [dir: string]: string }> {
    const root = path.resolve(
      this.options.getProjectPath(),
      tenant,
      this.options.getTenantDocumentsPath(),
    );
    const docs = await this.loadHdmlFiles(root);
    return docs;
  }

  public async loadHdmlFiles(
    dir: string,
  ): Promise<{ [dir: string]: string }> {
    let docs: { [dir: string]: string } = {};
    const directory = opendirSync(dir);
    for await (const dirent of directory) {
      if (dirent.isDirectory()) {
        const sub = await this.loadHdmlFiles(
          path.resolve(dir, dirent.name),
        );
        docs = {
          ...docs,
          ...sub,
        };
      } else if (
        dirent.isFile() &&
        dirent.name.indexOf(
          `.${this.options.getTenantDocumentsExt()}`,
        ) > 0
      ) {
        const full = path.resolve(dir, dirent.name);
        const key = full.split(this.options.getProjectPath())[1];
        const doc = await this.loadFile(full);
        docs[key] = doc;
      }
    }
    return docs;
  }

  /**
   * Loads file from disk and returns its content.
   */
  private async loadFile(file: string): Promise<string> {
    try {
      accessSync(file, constants.R_OK);
    } catch (err) {
      throw new Error(`The ${file} file is not readable.`);
    }
    const content = readFileSync(file, "utf8");
    return Promise.resolve(content);
  }
}

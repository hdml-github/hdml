import { Injectable, OnModuleInit } from "@nestjs/common";
import { program } from "commander";

type Options = {
  project: string;
};

/**
 * Options service.
 */
@Injectable()
export class OptionsService implements OnModuleInit {
  private options: null | Options = null;

  public onModuleInit(): void {
    program.option("--project <project>");
    program.parse();
    this.options = program.opts() as unknown as Options;
  }

  /**
   * Returns project directory path.
   */
  public getProjectPath(): string {
    return this.options?.project || ".";
  }

  /**
   * Returns tenant's environment file name.
   */
  public getTenantEnvName(): string {
    return ".env";
  }

  /**
   * Returns tenant's keys directory path.
   */
  public getTenantKeysPath(): string {
    return "keys";
  }

  /**
   * Returns tenant's private key name.
   */
  public getTenantPrivateKeyName(): string {
    return "key";
  }

  /**
   * Returns tenant's public key name.
   */
  public getTenantPublicKeyName(): string {
    return "key.pub";
  }

  /**
   * Returns tenant's middlewares directory path.
   */
  public getTenantMiddlewaresPath(): string {
    return "middlewares";
  }

  /**
   * Returns tenant's `hdml` documents root directory path.
   */
  public getTenantDocumentsPath(): string {
    return "hdml";
  }

  /**
   * Returns tenant's `hdml` documents files extension.
   */
  public getTenantDocumentsExt(): string {
    return "html";
  }

  /**
   * Returns keys import algorythm.
   */
  public getKeysImportAlg(): string {
    return "ES256";
  }

  /**
   * Returns compiler min pages pool size.
   */
  public getCompilerPoolMin(): number {
    return 2;
  }

  /**
   * Returns compiler max pages pool size.
   */
  public getCompilerPoolMax(): number {
    return 10;
  }

  /**
   * Returns compiler pool max waiting clients number.
   */
  public getCompilerPoolQueueSize(): number {
    return 50;
  }

  /**
   * Returns max frame depth to break compiler loop.
   */
  public getCompilerFramesDepth(): number {
    return 50;
  }
}

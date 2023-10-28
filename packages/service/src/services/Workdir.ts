/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  Injectable,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Dir, stat, opendir, readdir, readFile } from "fs";
import { resolve } from "path";
import { Config } from "./Config";
import { Thread } from "./Thread";
import { Logger } from "./Logger";

/**
 * Workdir files loader service.
 */
@Injectable()
export class Workdir {
  private _logger: Logger;
  private _elementsScript: null | string = null;
  private _parserScript: null | string = null;

  /**
   * @constructor
   */
  public constructor(
    private _config: Config,
    private _thread: Thread,
  ) {
    this._logger = new Logger("Workdir", this._thread);
  }

  /**
   * Returns the `@hdml/elements` bundle content.
   */
  public async getElementsScript(): Promise<string> {
    if (!this._elementsScript) {
      this._elementsScript = await this.openFile(
        resolve(
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
    }
    return this._elementsScript;
  }

  /**
   * Returns the `@hdml/parser` bundle content.
   */
  public async getParserScript(): Promise<string> {
    if (!this._parserScript) {
      this._parserScript = await this.openFile(
        resolve(
          __dirname,
          "..",
          "..",
          "node_modules",
          "@hdml",
          "parser",
          "bin",
          "parser.min.js",
        ),
      );
    }
    return this._parserScript;
  }

  /**
   * Returns an array of tenants.
   */
  public async getTenants(): Promise<string[]> {
    const tenants: string[] = [];
    const workdir = await new Promise<Dir>((resolve, reject) => {
      opendir(this._config.workdirPath, (err, dir) => {
        if (err) {
          reject(err);
        } else {
          resolve(dir);
        }
      });
    });
    for await (const dirent of workdir) {
      if (dirent.isDirectory() && dirent.name.indexOf(".") !== 0) {
        tenants.push(dirent.name);
      }
    }
    return tenants;
  }

  /**
   * Returns `.env` file content of the specified `tenant`. Throws if
   * file doesn't exists.
   */
  public async openEnv(tenant: string): Promise<string> {
    const path = resolve(
      this._config.workdirPath,
      tenant,
      this._config.workdirEnvFile,
    );
    return this.openFile(path);
  }

  /**
   * Returns private key file content of the specified `tenant`.
   * Throws if file doesn't exists.
   */
  public async loadKey(tenant: string): Promise<string> {
    const path = resolve(
      this._config.workdirPath,
      tenant,
      this._config.workdirKeysPath,
      this._config.workdirKeyFile,
    );
    return this.openFile(path);
  }

  /**
   * Returns public key file content of the specified `tenant`.
   * Throws if file doesn't exists.
   */
  public async loadPub(tenant: string): Promise<string> {
    const path = resolve(
      this._config.workdirPath,
      tenant,
      this._config.workdirKeysPath,
      this._config.workdirPubFile,
    );
    return this.openFile(path);
  }

  /**
   * Returns hook index file content of the specified `tenant`.
   * Throws if file doesn't exists.
   */
  public async loadHook(tenant: string): Promise<string> {
    const path = resolve(
      this._config.workdirPath,
      tenant,
      this._config.workdirHooksPath,
      "index.js",
    );
    return this.openFile(path);
  }

  /**
   * Returns `tenant`'s file with the `hdml` markup specified by the
   * `path`.
   */
  public async loadHdml(
    tenant: string,
    path: string,
  ): Promise<string> {
    return await this.openFile(
      resolve(
        this._config.workdirPath,
        tenant,
        this._config.workdirHdmlPath,
        `.${path}`,
      ),
    );
  }

  /**
   * Returns the hash map of the specified `tenant`'s `hdml` files.
   */
  public async loadHdmls(
    tenant: string,
  ): Promise<Record<string, string>> {
    const hdmls: Record<string, string> = {};
    const _path = resolve(
      this._config.workdirPath,
      tenant,
      this._config.workdirHdmlPath,
    );
    const files = (await this.listFiles(resolve(_path)))
      .filter((f) => f.indexOf(`.${this._config.workdirHdmlExt}`) > 0)
      .map((f) => f.split(_path)[1]);
    await Promise.all(
      files.map(async (f) => {
        hdmls[f] = await this.openFile(resolve(_path, f));
      }),
    );
    return hdmls;
  }

  /**
   * Determines if specified `path` is a directory or not.
   */
  private async isDir(path: string): Promise<boolean> {
    return new Promise((resolve) => {
      stat(path, (err, stats) => {
        if (err) {
          resolve(false);
        } else {
          resolve(stats.isDirectory());
        }
      });
    });
  }

  /**
   * Determines if specified `path` is a file or not.
   */
  private async isFile(path: string): Promise<boolean> {
    return new Promise((resolve) => {
      stat(path, (err, stats) => {
        if (err) {
          resolve(false);
        } else {
          resolve(stats.isFile());
        }
      });
    });
  }

  /**
   * Returns file's content specified by the `path`. Throws if file
   * doesn't exists.
   */
  private async openFile(path: string): Promise<string> {
    if (!(await this.isFile(path))) {
      throw new HttpException(
        `The ${path} file is not readable.`,
        HttpStatus.MISDIRECTED,
      );
    } else {
      return new Promise((resolve, reject) => {
        readFile(path, { encoding: "utf8" }, (err, data) => {
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
   * Returns an array of all files paths that are exists in the
   * specified `path` and its sub folders.
   */
  private async listFiles(path: string): Promise<string[]> {
    return new Promise((res, rej) => {
      readdir(path, (err, paths) => {
        if (err) {
          rej(err);
        } else {
          let files: string[] = [];
          const promises: Promise<string[]>[] = paths.map(
            async (_path) => {
              _path = resolve(path, _path);
              if (await this.isDir(_path)) {
                return await this.listFiles(_path);
              } else if (await this.isFile(_path)) {
                return [_path];
              } else {
                throw new HttpException(
                  `Invalid path type: ${_path}`,
                  HttpStatus.MISDIRECTED,
                );
              }
            },
          );
          Promise.all(promises)
            .then((pathsArray) => {
              files = files.concat(...pathsArray);
              res(files);
            })
            .catch((reason) => {
              rej(reason);
            });
        }
      });
    });
  }
}

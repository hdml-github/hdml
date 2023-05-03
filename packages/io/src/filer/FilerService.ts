import * as path from "path";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { watch, FSWatcher } from "chokidar";
import { OptionsService } from "../options/OptionsService";

/**
 * Files system service.
 */
@Injectable()
export class FilerService implements OnModuleInit {
  private _watcher: null | FSWatcher = null;

  /**
   * Class constructor.
   */
  constructor(private readonly options: OptionsService) {}

  /**
   * Module initialized callback.
   */
  public onModuleInit(): void {
    this._watcher = watch(this.options.getProjectPath(), {
      persistent: true,
      ignored: ["**/.*", "**/compose.yaml"],
    });

    // Common:
    this._watcher.on("ready", this._readyListener);
    this._watcher.on("error", this._errorListener);

    // Files:
    this._watcher.on("add", this._fileAddedListener);
    this._watcher.on("change", this._fileChangedListener);
    this._watcher.on("unlink", this._fileRemovedListener);

    // Directories:
    this._watcher.on("addDir", this._dirAddedListener);
    this._watcher.on("unlinkDir", this._dirRemovedListener);
  }

  /**
   * Returns tenants list.
   */
  public getTenants(): string[] {
    const paths = this.getWatchedPaths();
    return Object.keys(paths)
      .filter((val: string) => {
        return val.split(path.sep).length === 2;
      })
      .map((val: string) => {
        return val.split(path.sep)[1];
      });
  }

  /**
   * Returns an object representing all the paths on the file system
   * being watched.
   */
  public getWatchedPaths(): { [directory: string]: string[] } {
    const result: { [directory: string]: string[] } = {};
    if (this._watcher) {
      const base = this.options.getProjectPath();
      const warched = this._watcher.getWatched();
      Object.keys(warched).forEach((directory) => {
        const key = directory.split(base)[1];
        if (key) {
          result[`.${key}`] = warched[directory];
        }
      });
    }
    return result;
  }

  private _readyListener = () => {
    console.log(this.getWatchedPaths());
    console.log(this.getTenants());
  };

  private _errorListener = (error: Error) => {
    console.error(error);
  };

  private _fileAddedListener = (path: string) => {
    console.log(`File ${path} has been added.`);
  };

  private _fileChangedListener = (path: string) => {
    console.log(`File ${path} has been changed.`);
  };

  private _fileRemovedListener = (path: string) => {
    console.log(`File ${path} has been removed.`);
  };

  private _dirAddedListener = (path: string) => {
    console.log(`Directory ${path} has been added.`);
  };

  private _dirRemovedListener = (path: string) => {
    console.log(`Directory ${path} has been removed.`);
  };
}

import * as pool from "generic-pool";
import puppeteer, { Browser, Page, ElementHandle } from "puppeteer";
import { Injectable } from "@nestjs/common";
import { ModelData, FrameData } from "@hdml/schema";
import { IoElement, IoJson } from "@hdml/elements";

/**
 * Compiler service.
 */
@Injectable()
export class CompilerService {
  /**
   * Puppeteer browser instance.
   */
  private _browser: null | Browser = null;

  /**
   * Puppeteer pages pool instance.
   */
  private _pool: null | pool.Pool<Page> = null;

  /**
   * Bootstrap service by running headless browser and preparing pages
   * pool.
   */
  public async bootstrap(script: string): Promise<void> {
    this._browser = await puppeteer.launch({
      // headless: false,
      // devtools: true,
      headless: "new",
      devtools: false,
    });
    let createPage = false;
    this._pool = pool.createPool<Page>(
      {
        create: async () => {
          if (!this._browser) {
            throw new Error("Browser is not ready.");
          }
          const pages = await this._browser.pages();
          let page: Page;
          if (!createPage) {
            createPage = true;
            page = pages[0];
          } else {
            page = await this._browser.newPage();
          }
          await this.configurePage(page, script);
          return page;
        },
        destroy: async (page: Page) => {
          if (!page.isClosed()) {
            await page.close();
          }
        },
        validate: async (page: Page) => {
          return Promise.resolve(true);
        },
      },
      {
        min: 2,
        max: 10,
        maxWaitingClients: 50,
        testOnBorrow: false,
        evictionRunIntervalMillis: 0,
      },
    );
  }

  /**
   * Gracefully shutting down service.
   */
  public async shutdown(): Promise<void> {
    await this._pool?.drain();
    await this._browser?.close();
    this._pool = null;
    this._browser = null;
  }

  /**
   * Compiles provided `hdml` document.
   */
  public async compile(hdml: string): Promise<IoJson> {
    return this.compilePuppeteer(hdml);
  }

  /**
   * Completes fragments to a document's state.
   */
  public complete(fragments: { [path: string]: IoJson }): {
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
   * Compiles `hdml` document using Puppeteer.
   */
  private async compilePuppeteer(hdml: string): Promise<IoJson> {
    if (this._browser && this._pool) {
      const page = await this._pool.acquire();
      await this.renderBody(page, hdml);
      const io = (await page.$(
        "hdml-io",
      )) as ElementHandle<IoElement>;
      const json = await io.evaluate((elm) => {
        return elm.toJSON();
      });
      await this.removeBody(page);
      await this._pool.release(page);
      return json;
    } else {
      throw new Error("Browser is missed.");
    }
  }

  /**
   * Searchs a `model` for the specified `current` path and the
   * specified `fragment`.
   */
  private lookupModel(
    fragments: { [path: string]: IoJson },
    current: string,
    source: string,
  ): ModelData {
    let src: null | string = source;
    let curr = current;
    while (src) {
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
    throw new Error("Lookup model failed.");
  }

  /**
   * Asserts `source` value for the specified `current` path and the
   * specified `fragments`.
   */
  private assertSource(
    fragments: { [path: string]: IoJson },
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
   * Configures browser page.
   */
  private async configurePage(
    page: Page,
    script: string,
  ): Promise<void> {
    page.on("console", (msg) => {
      console.log(`browser: ${msg.text()}`);
    });
    await page.addScriptTag({
      content: this.getScript(script),
    });
  }

  /**
   * Returns scripts content.
   */
  private getScript(script: string): string {
    return `${script}\n
    (async () => {
      await window['@hdml/elements'].defineDefaults();
    })();`;
  }

  /**
   * Renders `hdml` content on the page body.
   */
  private async renderBody(page: Page, hdml: string): Promise<void> {
    await page.$eval(
      "body",
      (elm, hdml) => {
        elm.innerHTML = hdml;
      },
      this.getBody(hdml),
    );
  }

  /**
   * Returns body content.
   */
  private getBody(hdml: string): string {
    return `<hdml-io
      name="hdml.io"
      host="hdml.io"
      tenant="common"
      token="token"></hdml-io>\n${hdml}`;
  }

  /**
   * Removes page body content.
   */
  private async removeBody(page: Page): Promise<void> {
    await page.$eval("body", (elm) => {
      elm.textContent = null;
    });
  }
}

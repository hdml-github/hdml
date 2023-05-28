import * as pool from "generic-pool";
import puppeteer, { Browser, Page, ElementHandle } from "puppeteer";
import { Injectable, Logger } from "@nestjs/common";
import { IoElement, IoJson } from "@hdml/elements";
import { Options } from "./Options";

/**
 * Compiler service.
 */
@Injectable()
export class CompilerPuppeteer {
  /**
   * Service logger.
   */
  private readonly _logger = new Logger(CompilerPuppeteer.name, {
    timestamp: true,
  });

  /**
   * Puppeteer browser instance.
   */
  private _browser: null | Browser = null;

  /**
   * Puppeteer pages pool instance.
   */
  private _pool: null | pool.Pool<Page> = null;

  /**
   * Class constructor.
   */
  constructor(private readonly _options: Options) {}

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
        min: this._options.getCompilerPoolMin(),
        max: this._options.getCompilerPoolMax(),
        maxWaitingClients: this._options.getCompilerPoolQueueSize(),
        testOnBorrow: false,
        evictionRunIntervalMillis: 0,
      },
    );
    this._logger.log("The browser and the pages pool initialized");
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
   * Compiles `hdml` document using Puppeteer.
   */
  private async compilePuppeteer(hdml: string): Promise<IoJson> {
    if (this._browser && this._pool) {
      const page = await this._pool.acquire();
      await this.renderBody(page, hdml);
      const io = (await page.$(
        "hdml-io",
      )) as ElementHandle<IoElement>;
      const json = await io.evaluate(async (elm) => {
        return await elm.toJSON();
      });
      const a = await page.evaluate("console.log(window.document.querySelector('hdml-io'))");
      await this.removeBody(page, io);
      await this._pool.release(page);
      return json;
    } else {
      throw new Error("Browser is missed.");
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
      this._logger.debug(`Page ${msg.type()}: ${msg.text()}`);
    });
    await page.addScriptTag({
      content: this.getScript(script),
    });
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
   * Removes page body content.
   */
  private async removeBody(
    page: Page,
    io: ElementHandle<IoElement>,
  ): Promise<void> {
    await page.$$eval("hdml-model", (models) => {
      models.forEach((model) => {
        model.parentElement?.removeChild(model);
      });
    });
    await page.$$eval("hdml-frame", (frames) => {
      frames.forEach((frame) => {
        frame.parentElement?.removeChild(frame);
      });
    });
    await io.dispose();
    await page.$eval("body", (elm) => {
      elm.textContent = null;
    });
  }

  /**
   * Returns scripts content.
   */
  private getScript(script: string): string {
    return `${script}
    (async () => {
      await window['@hdml/elements'].defineDefaults();
    })();`;
  }

  /**
   * Returns body content.
   */
  private getBody(hdml: string): string {
    return `
      <hdml-io
        name="hdml.io"
        host="hdml.io"
        tenant="common"
        token="compiler_token">
      </hdml-io>
      ${hdml}`;
  }
}

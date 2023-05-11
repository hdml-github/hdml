import * as pool from "generic-pool";
import puppeteer, { Browser, Page } from "puppeteer";
import { Injectable } from "@nestjs/common";
import { IoElement } from "@hdml/elements";

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
  public async compile(hdml: string): Promise<unknown> {
    return this.compilePuppeteer(hdml);
  }

  /**
   * Compiles `hdml` document using Puppeteer.
   */
  private async compilePuppeteer(hdml: string): Promise<unknown> {
    if (this._browser && this._pool) {
      const page = await this._pool.acquire();
      await this.renderBody(page, hdml);
      const io = await page.$("hdml-io");
      const json = await io?.evaluate(async (elm) => {
        const data: unknown = (<IoElement>elm).json;
        return Promise.resolve(data);
      });
      await this.removeBody(page);
      await this._pool.release(page);
      return json;
    }
    return;
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

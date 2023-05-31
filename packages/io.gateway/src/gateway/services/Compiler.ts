import { TextEncoder, TextDecoder } from "util";
import { JSDOM, DOMWindow } from "jsdom";
import { Injectable, Logger } from "@nestjs/common";
import { Document } from "@hdml/schema";
import {
  UnifiedElement,
  IoElement,
  ElementsData,
} from "@hdml/elements";
import { Options } from "./Options";

export type HookFn = (
  scope: object,
  window: DOMWindow,
) => Promise<void>;

/**
 * Compiler service.
 */
@Injectable()
export class Compiler {
  /**
   * Service logger.
   */
  private readonly _logger = new Logger(Compiler.name, {
    timestamp: true,
  });

  /**
   * The `@hdml/elements` module bundle script content.
   */
  private _script = "";

  /**
   * Class constructor.
   */
  constructor(private readonly _options: Options) {}

  /**
   * Bootstrap service by running headless browser and preparing pages
   * pool.
   */
  public async bootstrap(script: string): Promise<void> {
    this._script = script;
    this._logger.log("DOM pool initialized");
    return Promise.resolve();
  }

  /**
   * Gracefully shutting down service.
   */
  public async shutdown(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Compiles provided `html` string to an `ElementsData` object.
   */
  public async compile(html: string): Promise<ElementsData> {
    const dom = this.getDOM(html);
    const io = <IoElement>(
      dom.window.document.querySelector("hdml-io")
    );
    const data = await io.getElementsData();
    dom.window.close();
    return data;
  }

  /**
   * Patches provided `hdml` document.
   */
  public async getHdmlDocument(
    hdml: string,
    hook: HookFn,
    context: object,
  ): Promise<null | Document> {
    const dom = this.getDOM(hdml);
    await hook(context, dom.window);
    const io = <IoElement>(
      dom.window.document.querySelector("hdml-io")
    );
    const root = <UnifiedElement>(
      dom.window.document.querySelector("[root=root]")
    );
    const document = await io.getHdmlDocument(root.uid);
    return document;
  }

  private getDOM(hdml: string): JSDOM {
    return new JSDOM(this.getHTML(hdml), {
      runScripts: "dangerously",
      beforeParse(window) {
        window.TextEncoder = TextEncoder;
        window.TextDecoder = TextDecoder;
      },
    });
  }

  private getHTML(hdml: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <script>
            function getRandomValues(abv) {
              var l = abv.length
              while (l--) {
                abv[l] = Math.floor(randomFloat() * 256)
              }
              return abv
            }
            function randomFloat() {
              return Math.random()
            }
            window.crypto = window.crypto || {};
            window.crypto.getRandomValues =
              window.crypto.getRandomValues ||
              getRandomValues;
          </script>
          <script>${this._script}</script>
          <script>
            (async () => {
              await window['@hdml/elements'].defineDefaults();
            })();
          </script>
        </head>
        <body>
          <hdml-io
            name="hdml.io"
            host="hdml.io"
            tenant="common"
            token="compiler_token">
          </hdml-io>
          ${hdml}
        </body>
      </html>
    `;
  }
}

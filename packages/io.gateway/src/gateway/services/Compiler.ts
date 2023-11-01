/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { TextEncoder, TextDecoder } from "util";
import { JSDOM, DOMWindow } from "jsdom";
import { Injectable, Logger } from "@nestjs/common";
import { Query } from "@hdml/schema";
import {
  UnifiedElement,
  IoElement,
  FragmentDef,
} from "@hdml/elements";
import { Options } from "./Options";

/**
 * The function of intercepting the `html` document.
 */
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
   * Service bootstrap method.
   */
  public async bootstrap(script: string): Promise<void> {
    this._script = script;
    this._logger.log("DOM pool initialized");
    return Promise.resolve();
  }

  /**
   * Gracefully shutting down of the service.
   */
  public async shutdown(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Compiles the provided `html` string into an `FragmentDef` object.
   */
  public async compile(html: string): Promise<FragmentDef> {
    const dom = this.getDOM(html);
    const io = <IoElement>(
      dom.window.document.querySelector("hdml-io")
    );
    const data = await io.getFragmentDef();
    dom.window.close();
    return data;
  }

  /**
   * Compiles the provided `html` string into a `Query` object and
   * returns it.
   */
  public async getQuery(
    html: string,
    hook: HookFn,
    context: object,
  ): Promise<null | Query> {
    const dom = this.getDOM(html);
    await hook(context, dom.window);
    const io = <IoElement>(
      dom.window.document.querySelector("hdml-io")
    );
    const root = <UnifiedElement>(
      dom.window.document.querySelector("[root=root]")
    );
    return await io.getQuery(root.uid);
  }

  /**
   * Returns a `JSDOM` object for the provided `html` string.
   */
  private getDOM(html: string): JSDOM {
    return new JSDOM(this.getHtmlPage(html), {
      runScripts: "dangerously",
      beforeParse(window) {
        window.TextEncoder = TextEncoder;
        window.TextDecoder = TextDecoder;
      },
    });
  }

  /**
   * Returns the complete source text of the `html` page for the
   * provided `html` fragment.
   */
  private getHtmlPage(hdml: string): string {
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

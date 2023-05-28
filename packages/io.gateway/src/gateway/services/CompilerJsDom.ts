import * as pool from "generic-pool";
import { TextEncoder, TextDecoder } from "util";
import { JSDOM } from "jsdom";
import { Injectable, Logger } from "@nestjs/common";
import { IoElement, IoJson } from "@hdml/elements";
import { Options } from "./Options";

/**
 * Compiler service.
 */
@Injectable()
export class CompilerJsDom {
  /**
   * Service logger.
   */
  private readonly _logger = new Logger(CompilerJsDom.name, {
    timestamp: true,
  });

  /**
   * Puppeteer pages pool instance.
   */
  private _pool: null | pool.Pool<JSDOM> = null;
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
    this._pool = pool.createPool<JSDOM>(
      {
        create: async () => {
          return Promise.resolve(
            new JSDOM(
              `
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
                  <script>${script}</script>
                  <script>
                    (async () => {
                      await window['@hdml/elements'].defineDefaults();
                    })();
                  </script>
                </head>
                <body></body>
              </html>
            `,
              {
                runScripts: "dangerously",
                beforeParse(window) {
                  window.TextEncoder = TextEncoder;
                  window.TextDecoder = TextDecoder;
                },
              },
            ),
          );
        },
        destroy: async (dom: JSDOM) => {
          return Promise.resolve();
        },
        validate: async (dom: JSDOM) => {
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
    this._logger.log("DOM pool initialized");
    return Promise.resolve();
  }

  /**
   * Gracefully shutting down service.
   */
  public async shutdown(): Promise<void> {
    await this._pool?.drain();
    this._pool = null;
  }

  public async compile_(hdml: string): Promise<IoJson> {
    const dom = new JSDOM(
      `
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
    `,
      {
        runScripts: "dangerously",
        beforeParse(window) {
          window.TextEncoder = TextEncoder;
          window.TextDecoder = TextDecoder;
        },
      },
    );
    const io = <Element & { toJSON: () => Promise<IoJson> }>(
      dom.window.document.querySelector("hdml-io")
    );
    return await io.toJSON();
  }

  /**
   * Compiles provided `hdml` document.
   */
  public async compile(hdml: string): Promise<IoJson> {
    if (this._pool) {
      const content = `<hdml-io
        name="hdml.io"
        host="hdml.io"
        tenant="common"
        token="compiler_token">
      </hdml-io>
      ${hdml}`;
      const dom = await this._pool.acquire();
      dom.window.document.body.innerHTML = content;
      const io = <
        Element & {
          toJSON: () => Promise<IoJson>;
          dispose: () => Promise<void>;
        }
      >dom.window.document.querySelector("hdml-io");
      const data = await io.toJSON();
      const models =
        dom.window.document.querySelectorAll("hdml-model");
      const frames =
        dom.window.document.querySelectorAll("hdml-frame");
      frames.forEach((frame) => {
        frame.parentElement?.removeChild(frame);
      });
      models.forEach((model) => {
        model.parentElement?.removeChild(model);
      });
      io.parentNode?.removeChild(io);
      dom.window.document.body.innerHTML = "";
      await this._pool.release(dom);
      return data;
    } else {
      throw new Error("Pool is missed.");
    }
  }
}

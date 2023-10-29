/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { IoElement, FragmentDef } from "@hdml/elements";
import { Injectable } from "@nestjs/common";
import {
  Isolate,
  ExternalCopy,
  Reference,
  Context,
} from "isolated-vm";
import { JSDOM } from "jsdom";
import { TextEncoder, TextDecoder } from "util";
import { Config } from "./Config";
import { Logger } from "./Logger";
import { Thread } from "./Thread";
import { Workdir } from "./Workdir";

/**
 * Takes an `html` fragment with the `hdml` markup and convert it to
 * the `FragmentDef` object. This function applies user defined `hook`
 * function on the incomming fragment.
 */
type CompileFn = (fragment: string) => Promise<FragmentDef>;

/**
 * Disposes off all resources allocated for the `Isolated` instance.
 */
type ReleaseFn = () => void;

/**
 * Compiler object.
 */
export type Compiler = {
  compile: CompileFn;
  release: ReleaseFn;
};

/**
 * Compiler factory.
 */
@Injectable()
export class CompilerFactory {
  private _logger: Logger;

  /**
   * @constructor
   */
  public constructor(
    private _conf: Config,
    private _thread: Thread,
    private _workdir: Workdir,
  ) {
    this._logger = new Logger("CompilerFactory", this._thread);
  }

  /**
   * Evaluates and returns the `Compiler` object for the specified
   * `tenant`.
   */
  public async getCompiler(
    tenant: string,
    env: Record<string, string>,
  ): Promise<Compiler> {
    const isolate = new Isolate();

    // initializing context:
    const context = await isolate.createContext();
    const global = context.global;
    for (const name in env) {
      await global.set(name, env[name]);
    }
    await global.set("globalThis", global.derefInto());

    // attaching `log` function:
    await global.set(
      "log",
      (message: unknown, ...args: unknown[]) => {
        this._logger.debug(message, ...args);
      },
    );

    // attaching `fetch` function:
    await global.set(
      "_fetch",
      new Reference(async function (
        input: RequestInfo | URL,
        init?: RequestInit,
      ) {
        const result = await fetch(input, init);
        const data = await result.text();
        return new ExternalCopy(data);
      }),
    );
    const _fetch = await this.getMOD(
      isolate,
      context,
      `globalThis.fetch = function fetch(url) {
        const page = _fetch.applySyncPromise(
          undefined,
          [url],
          {},
        );
        return page.copy();
      };`,
    );

    // attaching `parse` function:
    const _parse = await this.getMOD(
      isolate,
      context,
      `${await this._workdir.getParserScript()};
      globalThis.parse = globalThis["@hdml/parser"].parse;`,
    );

    // attaching `hook` function:
    const _hook = await this.getMOD(
      isolate,
      context,
      `${await this._workdir.loadHook(tenant)}
      globalThis.hook = hook;`,
    );

    // attaching `execute` function:
    const _execute = await this.getMOD(
      isolate,
      context,
      `export default function execute(html) {
        const dom = parse(html);
        const hooked = hook(dom);
        return hooked.toString();
      };`,
    );

    return {
      compile: async (fragment: string) => {
        const hooked = <string>(
          await _execute.apply(null, [fragment], {})
        );
        const dom = await this.getDOM(hooked);
        const io = <IoElement>(
          dom.window.document.querySelector("hdml-io")
        );
        const data = await io.getElementsDef();
        dom.window.close();
        return data;
      },
      release: () => {
        _fetch.release();
        _parse.release();
        _hook.release();
        _execute.release();
        global.release();
        context.release();
        isolate.dispose();
      },
    };
  }

  /**
   * Initialize and evaluates module inside the specified `isolate`.
   * Returns initialized module's `default` export.
   */
  private async getMOD(
    isolate: Isolate,
    context: Context,
    script: string,
  ): Promise<Reference> {
    const mod = await isolate.compileModule(script);
    await mod.instantiate(context, () => mod);
    await mod.evaluate();
    const ns = mod.namespace;
    const def = await ns.get("default", { reference: true });
    return def;
  }

  /**
   * Returns a `JSDOM` object for the provided `fragment`.
   */
  private async getDOM(fragment: string): Promise<JSDOM> {
    const html = await this.getHTML(fragment);
    return new JSDOM(html, {
      runScripts: "dangerously",
      beforeParse(window) {
        window.TextEncoder = TextEncoder;
        window.TextDecoder = TextDecoder;
      },
    });
  }

  /**
   * Returns the complete source text of the `html` page for the
   * provided `fragment`.
   */
  private async getHTML(fragment: string): Promise<string> {
    const script = await this._workdir.getElementsScript();
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
          <script>
            ${script}
          </script>
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
          ${fragment}
        </body>
      </html>
    `;
  }
}

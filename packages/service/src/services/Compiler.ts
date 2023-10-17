/* eslint-disable max-len */
/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { IoElement } from "@hdml/elements";
import { Injectable } from "@nestjs/common";
import { Isolate } from "isolated-vm";
import { JSDOM, DOMWindow } from "jsdom";
import { TextEncoder, TextDecoder } from "util";
import { Config } from "./Config";
import { Logger } from "./Logger";
import { Thread } from "./Thread";
import { Workdir } from "./Workdir";

/**
 * Compiler service.
 */
@Injectable()
export class Compiler {
  private _logger: Logger;

  /**
   * @constructor
   */
  constructor(
    private _conf: Config,
    private _thread: Thread,
    private _workdir: Workdir,
  ) {
    this._logger = new Logger("Compiler", this._thread);
  }

  /**
   *
   */
  public async test(): Promise<void> {
    // const isolate = new Isolate();
    const dom = await this.getDOM(this.getFragment());
    const io = <IoElement>(
      dom.window.document.querySelector("hdml-io")
    );
    const data = await io.getElementsDef();
    dom.window.close();
    this._logger.log(JSON.stringify(data, undefined, 2));
    // return data;
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

  private getFragment(): string {
    return `
      <hdml-model
        name="model">
        <hdml-table
          name="tables"
          type="table"
          source="\`tenant_postgres\`.\`information_schema\`.\`tables\`">
          <hdml-field
            name="catalog"
            origin="table_catalog">
          </hdml-field>
          <hdml-field
            name="schema"
            origin="table_schema">
          </hdml-field>
          <hdml-field
            name="table"
            origin="table_name">
          </hdml-field>
          <hdml-field
            name="full"
            clause="concat(\`table_catalog\`, '-', \`table_schema\`, '-', \`table_name\`)">
          </hdml-field>
          <hdml-field
            name="hash"
            clause="concat(\`table_catalog\`, '-', \`table_schema\`, '-', \`table_name\`)"
            type="binary">
          </hdml-field>
          <hdml-field
            name="type"
            origin="table_type">
          </hdml-field>
        </hdml-table>
      
        <hdml-table
          name="columns"
          type="query"
          source="select * from \`tenant_postgres\`.\`information_schema\`.\`columns\`">
          <hdml-field
            name="catalog"
            origin="table_catalog">
          </hdml-field>
          <hdml-field
            name="schema"
            origin="table_schema">
          </hdml-field>
          <hdml-field
            name="table"
            origin="table_name">
          </hdml-field>
          <hdml-field
            name="column"
            origin="column_name">
          </hdml-field>
          <hdml-field
            name="position"
            origin="ordinal_position"
            type="int-32">
          </hdml-field>
          <hdml-field
            name="default"
            origin="column_default">
          </hdml-field>
          <hdml-field
            name="nullable"
            origin="is_nullable">
          </hdml-field>
          <hdml-field
            name="type"
            origin="data_type">
          </hdml-field>
        </hdml-table>
      
        <hdml-join
          type="inner"
          left="tables"
          right="columns">
          <hdml-connective
            operator="and">
      
            <hdml-filter
              type="keys"
              left="catalog"
              right="catalog">
            </hdml-filter>
            
            <hdml-filter
              type="keys"
              left="schema"
              right="schema">
            </hdml-filter>
            
            <hdml-filter
              type="keys"
              left="table"
              right="table">
            </hdml-filter>            
            
            <hdml-connective
              operator="or">
              <hdml-filter
                type="expr"
                clause="\`columns\`.\`table\` = 'applicable_roles'">
              </hdml-filter>
              <hdml-filter
                type="expr"
                clause="\`columns\`.\`table\` = 'tables'">
              </hdml-filter>
            </hdml-connective>
          </hdml-connective>
        </hdml-join>
      </hdml-model>`;
  }
}

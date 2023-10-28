/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Controller, Get } from "@nestjs/common";
import { Tenants } from "../../../services/Tenants";
import { Logger } from "../../../services/Logger";
import { Thread } from "../../../services/Thread";

/**
 * The `api/v0/tests` endpoint controller.
 */
@Controller({ path: "api/v0/tests" })
export class tests {
  private _logger: Logger;

  /**
   * Class constructor.
   */
  constructor(private _tenants: Tenants, private _thread: Thread) {
    this._logger = new Logger("api/v0/tests", this._thread);
  }

  @Get()
  async run(): Promise<void> {
    await this.loadQueryDef();
  }

  private async loadQueryDef(): Promise<void> {
    const queryDef = await this._tenants.getQueryDef(
      "common",
      "/frames/query.html?hdml-frame=query",
    );
    this._logger.log(queryDef);
    return;
  }

  private async compileFragment(): Promise<void> {
    const compiler = await this._tenants.getCompiler("common");
    const value = await compiler.compile(this.getFragment());
    this._logger.log(value);
    return;
  }

  private getFragment(): string {
    return (
      `
      <hdml-model
        name="model">
        <hdml-table
          name="tables"
          type="table"
          source="\`postgres\`.\`information_schema\`.\`tables\`">
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
            clause="concat(\`table_catalog\`, '-', ` +
      `\`table_schema\`, '-', \`table_name\`)">
          </hdml-field>
          <hdml-field
            name="hash"
            clause="concat(\`table_catalog\`, '-', ` +
      `\`table_schema\`, '-', \`table_name\`)"
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
          source="select * from ` +
      `\`tenant_postgres\`.\`information_schema\`.\`columns\`">
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
      </hdml-model>`
    );
  }
}

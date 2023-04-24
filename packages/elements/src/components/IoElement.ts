/**
 * @fileoverview The `HostElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import "whatwg-fetch";
import { html, TemplateResult } from "lit";
import { debounce } from "throttle-debounce";
import {
  IO_NAME_REGEXP,
  IO_HOST_REGEXP,
  IO_TENANT_REGEXP,
  IO_TOKEN_REGEXP,
} from "../helpers/constants";
import { UnifiedElement } from "./UnifiedElement";

/**
 * `IoElement` class.
 */
export class IoElement extends UnifiedElement {
  /**
   * Reactive attributes.
   */
  public static properties = {
    /**
     * A `name` property definition.
     */
    name: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `host` property definition.
     */
    host: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `tenant` property definition.
     */
    tenant: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `token` property definition.
     */
    token: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },
  };

  /**
   * A `name` private property.
   */
  private _name: null | string = null;

  /**
   * A `host` private property.
   */
  private _host: null | string = null;

  /**
   * A `tenant` private property.
   */
  private _tenant: null | string = null;

  /**
   * A `token` private property.
   */
  private _token: null | string = null;

  /**
   * Debouncer to delay `hdml`-elements
   */
  private _debouncer: null | debounce<() => void> = null;

  /**
   * A `name` setter.
   */
  public set name(val: null | string) {
    if (val === null || val === "" || IO_NAME_REGEXP.test(val)) {
      const old = this._name;
      this._name = val;
      this.requestUpdate("name", old);
    } else {
      console.error(
        `The \`name\` property value "${val}" doesn't match an ` +
          "element schema. Skipped.",
      );
      if (this.getAttribute("name") === val) {
        if (this._name === null) {
          this.removeAttribute("name");
        } else {
          this.setAttribute("name", this._name);
        }
      }
    }
  }

  /**
   * A `name` getter.
   */
  public get name(): null | string {
    return this._name;
  }

  /**
   * A `host` setter.
   */
  public set host(val: null | string) {
    if (val === null || val === "" || IO_HOST_REGEXP.test(val)) {
      const old = this._host;
      this._host = val;
      this.requestUpdate("host", old);
    } else {
      console.error(
        `The \`host\` property value "${val}" doesn't match an ` +
          "element schema. Skipped.",
      );
      if (this.getAttribute("host") === val) {
        if (this._host === null) {
          this.removeAttribute("host");
        } else {
          this.setAttribute("host", this._host);
        }
      }
    }
  }

  /**
   * A `host` getter.
   */
  public get host(): null | string {
    return this._host;
  }

  /**
   * A `tenant` setter.
   */
  public set tenant(val: null | string) {
    if (val === null || val === "" || IO_TENANT_REGEXP.test(val)) {
      const old = this._tenant;
      this._tenant = val;
      this.requestUpdate("tenant", old);
    } else {
      console.error(
        `The \`tenant\` property value "${val}" doesn't match an ` +
          "element schema. Skipped.",
      );
      if (this.getAttribute("tenant") === val) {
        if (this._tenant === null) {
          this.removeAttribute("tenant");
        } else {
          this.setAttribute("tenant", this._tenant);
        }
      }
    }
  }

  /**
   * A `tenant` getter.
   */
  public get tenant(): null | string {
    return this._tenant;
  }

  /**
   * A `token` setter.
   */
  public set token(val: null | string) {
    if (val === null || val === "" || IO_TOKEN_REGEXP.test(val)) {
      const old = this._token;
      this._token = val;
      this.requestUpdate("token", old);
    } else {
      console.error(
        `The \`token\` property value "${val}" doesn't match an ` +
          "element schema. Skipped.",
      );
      if (this.getAttribute("token") === val) {
        if (this._token === null) {
          this.removeAttribute("token");
        } else {
          this.setAttribute("token", this._token);
        }
      }
    }
  }

  /**
   * A `token` getter.
   */
  public get token(): null | string {
    return this._token;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    console.log("connected");
    super.connectedCallback();
    this._debouncer = debounce(10, async () => {
      await this.fetchData();
    });
    this._debouncer();
  }

  private async fetchData(): Promise<void> {
    console.log("fetching");
    try {
      const response = await fetch(this._host || "localhost", {
        method: "POST",
        mode: "no-cors",
        redirect: "follow",
        cache: "no-cache",
        headers: {
          Accept: "text/html; charset=utf-8",
          "Content-Type": "text/html; charset=utf-8",
        },
        body: `
        with "frame" as (
          with "model" as (
            with
              "columns" as (
                with _columns as (
                  select * from
                  tenant_postgres.information_schema.columns
                )
                select
                  "table_catalog" as "catalog",
                  "column_name" as "column",
                  "column_default" as "default",
                  "is_nullable" as "nullable",
                  try_cast(
                    "ordinal_position" as integer
                  ) as "position",
                  "table_schema" as "schema",
                  "table_name" as "table",
                  "data_type" as "type"
                from
                  _columns
              ),
              "tables" as (
                select
                  "table_catalog" as "catalog",
                  concat(
                    "table_catalog",
                    '-',
                    "table_schema",
                    '-',
                    "table_name"
                  ) as "full",
                  try_cast(
                    concat(
                      "table_catalog",
                      '-',
                      "table_schema",
                      '-',
                      "table_name"
                    ) as varbinary
                  ) as "hash",
                  "table_schema" as "schema",
                  "table_name" as "table",
                  "table_type" as "type"
                from
                  tenant_postgres.information_schema.tables
              )
            select
              "columns"."catalog" as "columns_catalog",
              "columns"."column" as "columns_column",
              "columns"."default" as "columns_default",
              "columns"."nullable" as "columns_nullable",
              "columns"."position" as "columns_position",
              "columns"."schema" as "columns_schema",
              "columns"."table" as "columns_table",
              "columns"."type" as "columns_type",
              "tables"."catalog" as "tables_catalog",
              "tables"."full" as "tables_full",
              "tables"."hash" as "tables_hash",
              "tables"."schema" as "tables_schema",
              "tables"."table" as "tables_table",
              "tables"."type" as "tables_type"
            from "tables"
            inner join "columns"
            on (
              1 = 1
              and "tables"."catalog" ="columns"."catalog"
              and "tables"."schema" ="columns"."schema"
              and "tables"."table" ="columns"."table"
              and (
                1 != 1
                or "columns"."table" = 'applicable_roles'
                or "columns"."table" = 'tables'
              )
            )
          )
          select
            "columns_catalog" as "catalog",
            "columns_column" as "column",
            count("columns_column") as "count",
            "columns_schema" as "schema",
            "columns_table" as "table"
          from
            "model"
          group by
            1, 4, 5, 2
          offset 0
          limit 1000
        )
        select
          "catalog" as "catalog",
          "schema" as "schema",
          sum("count") as "sum",
          "table" as "table"
        from
          "frame"
        where
          1 = 1
          and "catalog" = 'tenant_postgres'
          and "schema" = 'information_schema'
        group by
          1, 2, 4
        order by
          1, 2, 4 desc
        offset 0
        limit 100`,
      });
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      const data = await response.blob();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * @override
   */
  public attributeChangedCallback(
    name: string,
    old: string,
    value: string,
  ): void {
    super.attributeChangedCallback(name, old, value);
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._debouncer && this._debouncer.cancel();
  }

  /**
   * Component template.
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }
}

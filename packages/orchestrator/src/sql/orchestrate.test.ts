import {
  Document,
  DocumentData,
  DecimalOptsData,
  DateOptsData,
  TimeOptsData,
  TimestampOptsData,
  TableType,
  AggType,
  DateUnit,
  TimeUnit,
  TimeZone,
  DataType,
  DecimalBitWidth,
  JoinType,
  FilterOperator,
  FilterType,
} from "@hdml/schema";
import { getSQL } from "./orchestrate";

const data: DocumentData = {
  name: "Test HDML Document.",
  tenant: "common",
  token: "sometokenhere",
  model: {
    name: "model",
    host: "hostname",
    tables: [
      {
        name: "tables",
        type: TableType.Table,
        source: "tenant_postgres.information_schema.tables",
        fields: [
          {
            name: "catalog",
            origin: "table_catalog",
          },
          {
            name: "schema",
            origin: "table_schema",
          },
          {
            name: "table",
            origin: "table_name",
          },
          {
            name: "full",
            clause:
              `concat("table_catalog", '-', ` +
              `"table_schema", '-', "table_name")`,
          },
          {
            name: "hash",
            clause:
              `concat("table_catalog", '-', ` +
              `"table_schema", '-', "table_name")`,
            type: {
              type: DataType.Binary,
              options: {
                nullable: false,
              },
            },
          },
          {
            name: "type",
            origin: "table_type",
          },
        ],
      },
      {
        name: "columns",
        type: TableType.Query,
        source:
          "select * from tenant_postgres.information_schema.columns",
        fields: [
          {
            name: "catalog",
            origin: "table_catalog",
          },
          {
            name: "schema",
            origin: "table_schema",
          },
          {
            name: "table",
            origin: "table_name",
          },
          {
            name: "column",
            origin: "column_name",
          },
          {
            name: "position",
            origin: "ordinal_position",
            type: {
              type: DataType.Int32,
              options: {
                nullable: false,
              },
            },
          },
          {
            name: "default",
            origin: "column_default",
          },
          {
            name: "nullable",
            origin: "is_nullable",
          },
          {
            name: "type",
            origin: "data_type",
          },
        ],
      },
    ],
    joins: [
      {
        type: JoinType.Inner,
        left: "tables",
        right: "columns",
        clause: {
          type: FilterOperator.And,
          filters: [
            {
              type: FilterType.Keys,
              options: {
                left: "catalog",
                right: "catalog",
              },
            },
            {
              type: FilterType.Keys,
              options: {
                left: "schema",
                right: "schema",
              },
            },
            {
              type: FilterType.Keys,
              options: {
                left: "table",
                right: "table",
              },
            },
          ],
          children: [
            {
              type: FilterOperator.Or,
              filters: [
                {
                  type: FilterType.Expr,
                  options: {
                    clause: `"columns"."table" = 'applicable_roles'`,
                  },
                },
                {
                  type: FilterType.Expr,
                  options: {
                    clause: `"columns"."table" = 'tables'`,
                  },
                },
              ],
              children: [],
            },
          ],
        },
      },
    ],
  },
  frame: {
    name: "query",
    host: "hostname",
    source: "frame",
    offset: 1,
    limit: 1,
    fields: [
      {
        name: "catalog",
      },
      {
        name: "schema",
      },
      {
        name: "table",
      },
      {
        name: "sum",
        origin: "count",
        agg: AggType.Sum,
      },
    ],
    filterBy: {
      type: FilterOperator.And,
      filters: [
        {
          type: FilterType.Expr,
          options: {
            clause: `"catalog" = 'tenant_postgres'`,
          },
        },
        {
          type: FilterType.Expr,
          options: {
            clause: `"schema" = 'information_schema'`,
          },
        },
      ],
      children: [],
    },
    groupBy: [
      {
        name: "catalog",
      },
      {
        name: "schema",
      },
      {
        name: "table",
      },
    ],
    sortBy: [
      {
        name: "catalog",
      },
      {
        name: "schema",
      },
      {
        name: "table",
        asc: false,
      },
    ],
    parent: {
      name: "frame",
      host: "hostname",
      source: "model",
      offset: 0,
      limit: 1000,
      fields: [
        {
          name: "catalog",
          origin: "columns_catalog",
        },
        {
          name: "schema",
          origin: "columns_schema",
        },
        {
          name: "table",
          origin: "columns_table",
        },
        {
          name: "column",
          origin: "columns_column",
        },
        {
          name: "count",
          origin: "columns_column",
          agg: AggType.Count,
        },
      ],
      groupBy: [
        {
          name: "catalog",
        },
        {
          name: "schema",
        },
        {
          name: "table",
        },
        {
          name: "column",
        },
      ],
    },
  },
};

const document = new Document(data);

describe("Orchestrator", () => {
  it("convert document to a SQL string", () => {
    const sql = getSQL(document);
    console.log(sql);
  });
});

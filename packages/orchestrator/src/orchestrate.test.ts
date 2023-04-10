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
} from "@hdml/schema";
import { orchestrate } from "./orchestrate";

const data: DocumentData = {
  name: "Test HDML Document.",
  tenant: "common",
  token: "sometokenhere",
  model: {
    name: "Database info.",
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
            name: "type",
            origin: "table_type",
          },
        ],
      },
      {
        name: "columns",
        type: TableType.Table,
        source: "tenant_postgres.information_schema.columns",
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
  },
};

const document = new Document(data);

describe("Orchestrator", () => {
  it("convert document to a SQL string", () => {
    const sql = orchestrate(document);
    console.log(sql);
  });
});

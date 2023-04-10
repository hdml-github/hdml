import {
  type Document,
  type TableData,
  type FieldData,
  TableType,
  DataType,
} from "@hdml/schema";

export function orchestrate(document: Document): string {
  let sql = "";
  const model = document.model;
  if (model) {
    const tables = model.tables;
    tables.forEach((table: TableData) => {
      switch (table.type) {
        case TableType.Table:
          sql = getTableSQL(table);
          break;
        case TableType.Query:
          break;
        case TableType.Csv:
          break;
        case TableType.Json:
          break;
      }
    });
  }
  return sql;
}

export function getTableSQL(table: TableData): string {
  const fields = table.fields
    .map((field: FieldData) => getTableFieldSQL(field))
    .join(",\n");
  let sql = `\t\t"${table.name}" as (\n`;
  sql = sql + "\t\t\tselect\n";
  sql = sql + `${fields}\n`;
  sql = sql + "\t\t\tfrom\n";
  sql = sql + `\t\t\t\t${table.source}\n`;
  sql = sql + "\t\t)";
  return sql;
}

export function getTableFieldSQL(field: FieldData): string {
  const name = field.name;
  const origin = field.origin || field.name;
  let sql: string;
  if (!field.type) {
    sql = `"${origin}" as "${name}"`;
  } else {
    switch (field.type.type) {
      case DataType.Int8:
      case DataType.Uint8:
        sql = `try_cast("${origin}" as tinyint) as "${name}"`;
        break;
      case DataType.Int16:
      case DataType.Uint16:
        sql = `try_cast("${origin}" as smallint) as "${name}"`;
        break;
      case DataType.Int32:
      case DataType.Uint32:
        sql = `try_cast("${origin}" as integer) as "${name}"`;
        break;
      case DataType.Int64:
      case DataType.Uint64:
        sql = `try_cast("${origin}" as bigint) as "${name}"`;
        break;
      case DataType.Float16:
      case DataType.Float32:
        sql = `try_cast("${origin}" as real) as "${name}"`;
        break;
      case DataType.Float64:
        sql = `try_cast("${origin}" as double) as "${name}"`;
        break;
      case DataType.Decimal:
        sql =
          `try_cast("${origin}" as ` +
          `decimal(${field.type.options.scale}, ` +
          `${field.type.options.precision})) as ` +
          `"${name}"`;
        break;
      case DataType.Date:
        sql = `try_cast("${origin}" as date) as "${name}"`;
        break;
      case DataType.Time:
        sql = `try_cast("${origin}" as time) as "${name}"`;
        break;
      case DataType.Timestamp:
        sql = `try_cast("${origin}" as timestamp) as "${name}"`;
        break;
      case DataType.Binary:
        sql = `try_cast("${origin}" as varbinary) as "${name}"`;
        break;
      case DataType.Utf8:
        sql = `try_cast("${origin}" as varchar) as "${name}"`;
        break;
    }
  }
  return `\t\t\t\t${sql}`;
}

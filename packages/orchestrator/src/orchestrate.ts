import {
  type Document,
  type ModelData,
  type TableData,
  type FieldData,
  TableType,
  DataType,
} from "@hdml/schema";

export function orchestrate(document: Document): string {
  if (document.model) {
    return getModelSQL(document.model);
  }
  return "";
}

export function getModelSQL(model: ModelData): string {
  const tables = model.tables
    .map((table: TableData) => {
      switch (table.type) {
        case TableType.Table:
          return getModelTableSQL(table);
        case TableType.Query:
          return "";
        case TableType.Csv:
          return "";
        case TableType.Json:
          return "";
      }
    })
    .join(",\n");
  let sql = "\twith\n";
  sql = sql + `${tables}\n`;
  sql = sql + "\t\tselect\n";
  sql =
    sql +
    model.tables
      .sort((a, b) =>
        a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
      )
      .map((t) =>
        t.fields
          .map(
            (f) =>
              `\t\t\t` +
              `"${t.name}"."${f.name}" as "${t.name}.${f.name}"`,
          )
          .join(",\n"),
      )
      .join(",\n");
  sql = sql + "\n\t\tfrom\n";
  sql =
    sql + model.tables.map((t) => `\t\t\t"${t.name}"`).join(",\n");
  return sql;
}

export function getModelTableSQL(table: TableData): string {
  const fields = table.fields
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    .map((field: FieldData) => getModelTableFieldSQL(field))
    .join(",\n");
  let sql = `\t\t"${table.name}" as (\n`;
  sql = sql + "\t\t\tselect\n";
  sql = sql + `${fields}\n`;
  sql = sql + "\t\t\tfrom\n";
  sql = sql + `\t\t\t\t${table.source}\n`;
  sql = sql + "\t\t)";
  return sql;
}

export function getModelTableFieldSQL(field: FieldData): string {
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

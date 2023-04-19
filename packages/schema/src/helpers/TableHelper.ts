import { Builder } from "flatbuffers";
import { Table, Model } from "../.fbs/data.Model_generated";
import { TableType } from "../Enums";
import { FieldHelper, FieldData } from "./FieldHelper";

export type TableData = {
  name: string;
  type: TableType;
  source: string;
  fields: FieldData[];
};

export class TableHelper {
  private _field: FieldHelper;

  public constructor(private _builder: Builder) {
    this._field = new FieldHelper(this._builder);
  }

  public bufferizeTables(data: TableData[]): number[] {
    return data.map((t) => this.bufferizeTable(t));
  }

  public bufferizeTable(data: TableData): number {
    const name = this._builder.createString(data.name);
    const source = this._builder.createString(data.source);
    const offsets = this._field.bufferizeFields(data.fields);
    const fields = Table.createFieldsVector(this._builder, offsets);
    Table.startTable(this._builder);
    Table.addName(this._builder, name);
    Table.addSource(this._builder, source);
    Table.addType(this._builder, data.type);
    Table.addFields(this._builder, fields);
    return Table.endTable(this._builder);
  }

  public parseTables(model: Model): TableData[] {
    const tables: TableData[] = [];
    for (let i = 0; i < model.tablesLength(); i++) {
      const table = model.tables(i, new Table());
      if (table) {
        tables.push({
          name: table.name() || "",
          type: table.type(),
          source: table.source() || "",
          fields: this._field.parseFields(
            table.fields.bind(table),
            table.fieldsLength(),
          ),
        });
      }
    }
    return tables;
  }
}

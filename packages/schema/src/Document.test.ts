import {
  DecimalOptsData,
  DateOptsData,
  TimeOptsData,
  TimestampOptsData,
} from "./helpers/FieldHelper";
import { Document, DocumentData } from "./Document";
import {
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
  FilterName,
} from "./Enums";

describe("Document schema", () => {
  const documentData: DocumentData = {
    name: "Test HDML Document",
    tenant: "common",
    token: "sometokenhere",
    model: {
      name: "Test Model",
      host: "hostname",
      tables: [
        {
          name: "table1",
          type: TableType.Table,
          source: "catalog.schema.table1",
          fields: [
            {
              name: "field1",
              origin: "origin1",
              clause: "clause1",
              description: "description1",
              asc: false,
            },
            {
              name: "field2",
              origin: "origin2",
              clause: "clause2",
              description: "description2",
              agg: AggType.Avg,
            },
          ],
        },
        {
          name: "table2",
          type: TableType.Table,
          source: "catalog.schema.table2",
          fields: [
            {
              name: "field1",
              type: {
                type: DataType.Int8,
                options: {
                  nullable: true,
                },
              },
            },
            {
              name: "field2",
              type: {
                type: DataType.Utf8,
                options: {
                  nullable: true,
                },
              },
            },
            {
              name: "field3",
              type: {
                type: DataType.Decimal,
                options: {
                  nullable: true,
                  scale: 10,
                  precision: 10,
                  bitWidth: DecimalBitWidth._128,
                },
              },
            },
            {
              name: "field4",
              type: {
                type: DataType.Date,
                options: {
                  nullable: true,
                  unit: DateUnit.second,
                },
              },
            },
            {
              name: "field5",
              type: {
                type: DataType.Time,
                options: {
                  nullable: true,
                  unit: TimeUnit.nanosecond,
                },
              },
            },
            {
              name: "field6",
              type: {
                type: DataType.Timestamp,
                options: {
                  nullable: true,
                  unit: TimeUnit.nanosecond,
                  timezone: TimeZone.Europe_Kiev,
                },
              },
            },
          ],
        },
      ],
      joins: [
        {
          type: JoinType.Inner,
          left: "table1",
          right: "table2",
          clause: {
            type: FilterOperator.Or,
            filters: [
              {
                type: FilterType.Expr,
                options: {
                  clause: '"field1" = "field1"',
                },
              },
              {
                type: FilterType.Keys,
                options: {
                  left: "field1",
                  right: "field1",
                },
              },
              {
                type: FilterType.Named,
                options: {
                  name: FilterName.IsNotNull,
                  field: "field1",
                  values: [],
                },
              },
            ],
            children: [
              {
                type: FilterOperator.And,
                filters: [
                  {
                    type: FilterType.Expr,
                    options: {
                      clause: '"field1" = "field1"',
                    },
                  },
                  {
                    type: FilterType.Keys,
                    options: {
                      left: "field1",
                      right: "field1",
                    },
                  },
                  {
                    type: FilterType.Named,
                    options: {
                      name: FilterName.IsNotNull,
                      field: "field1",
                      values: [],
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
      name: "Test Frame",
      host: "hostname",
      source: "parent",
      limit: 1000,
      offset: 0,
      fields: [
        {
          name: "field1",
          origin: "origin1",
          clause: "clause1",
          description: "description1",
          agg: AggType.Count,
        },
        {
          name: "field2",
          origin: "origin2",
          clause: "clause2",
          description: "description2",
          agg: AggType.Avg,
        },
      ],
      filterBy: {
        type: FilterOperator.Or,
        filters: [
          {
            type: FilterType.Expr,
            options: {
              clause: '"field1" = "field1"',
            },
          },
          {
            type: FilterType.Keys,
            options: {
              left: "field1",
              right: "field1",
            },
          },
          {
            type: FilterType.Named,
            options: {
              name: FilterName.IsNotNull,
              field: "field1",
              values: [],
            },
          },
        ],
        children: [
          {
            type: FilterOperator.And,
            filters: [
              {
                type: FilterType.Expr,
                options: {
                  clause: '"field1" = "field1"',
                },
              },
              {
                type: FilterType.Keys,
                options: {
                  left: "field1",
                  right: "field1",
                },
              },
              {
                type: FilterType.Named,
                options: {
                  name: FilterName.IsNotNull,
                  field: "field1",
                  values: [],
                },
              },
            ],
            children: [],
          },
        ],
      },
      groupBy: [
        {
          name: "field1",
          origin: "origin1",
          clause: "clause1",
          description: "description1",
          agg: AggType.Count,
        },
      ],
      splitBy: [
        {
          name: "field2",
          origin: "origin2",
          clause: "clause2",
          description: "description2",
          agg: AggType.Avg,
        },
      ],
      sortBy: [
        {
          name: "field1",
          origin: "origin1",
          clause: "clause1",
          description: "description1",
          asc: true,
        },
        {
          name: "field2",
          origin: "origin2",
          clause: "clause2",
          description: "description2",
          asc: false,
        },
      ],
      parent: {
        name: "Test Frame",
        host: "hostname",
        source: "parent",
        limit: 1000,
        offset: 0,
        fields: [
          {
            name: "field1",
            origin: "origin1",
            clause: "clause1",
            description: "description1",
            agg: AggType.Count,
          },
          {
            name: "field2",
            origin: "origin2",
            clause: "clause2",
            description: "description2",
            agg: AggType.Avg,
          },
        ],
        filterBy: {
          type: FilterOperator.Or,
          filters: [
            {
              type: FilterType.Expr,
              options: {
                clause: '"field1" = "field1"',
              },
            },
            {
              type: FilterType.Keys,
              options: {
                left: "field1",
                right: "field1",
              },
            },
            {
              type: FilterType.Named,
              options: {
                name: FilterName.IsNotNull,
                field: "field1",
                values: [],
              },
            },
          ],
          children: [
            {
              type: FilterOperator.And,
              filters: [
                {
                  type: FilterType.Expr,
                  options: {
                    clause: '"field1" = "field1"',
                  },
                },
                {
                  type: FilterType.Keys,
                  options: {
                    left: "field1",
                    right: "field1",
                  },
                },
                {
                  type: FilterType.Named,
                  options: {
                    name: FilterName.IsNotNull,
                    field: "field1",
                    values: [],
                  },
                },
              ],
              children: [],
            },
          ],
        },
        groupBy: [
          {
            name: "field1",
            origin: "origin1",
            clause: "clause1",
            description: "description1",
            agg: AggType.Count,
          },
        ],
        splitBy: [
          {
            name: "field2",
            origin: "origin2",
            clause: "clause2",
            description: "description2",
            agg: AggType.Avg,
          },
        ],
        sortBy: [
          {
            name: "field1",
            origin: "origin1",
            clause: "clause1",
            description: "description1",
            asc: true,
          },
          {
            name: "field2",
            origin: "origin2",
            clause: "clause2",
            description: "description2",
            asc: false,
          },
        ],
      },
    },
  };

  let document1: Document;
  let document2: Document;

  it("must be constructible and parsable", () => {
    document1 = new Document(documentData);
    document2 = new Document(document1.buffer);

    // console.log(JSON.stringify(document2.frame, undefined, 2));

    expect(documentData.name).toEqual(document1.name);
    expect(documentData.name).toEqual(document2.name);

    expect(documentData.tenant).toEqual(document1.tenant);
    expect(documentData.tenant).toEqual(document2.tenant);

    expect(documentData.token).toEqual(document1.token);
    expect(documentData.token).toEqual(document2.token);

    expect(documentData.model?.name).toEqual(document1.model?.name);
    expect(documentData.model?.name).toEqual(document2.model?.name);

    expect(documentData.model?.host).toEqual(document1.model?.host);
    expect(documentData.model?.host).toEqual(document2.model?.host);

    expect(documentData.model?.tables.length).toEqual(
      document1.model?.tables.length,
    );
    expect(documentData.model?.tables.length).toEqual(
      document2.model?.tables.length,
    );

    documentData.model?.tables.forEach((table, i) => {
      expect(table.name).toEqual(document1.model?.tables[i].name);
      expect(table.name).toEqual(document2.model?.tables[i].name);

      expect(table.type).toEqual(document1.model?.tables[i].type);
      expect(table.type).toEqual(document2.model?.tables[i].type);

      expect(table.source).toEqual(document1.model?.tables[i].source);
      expect(table.source).toEqual(document2.model?.tables[i].source);

      expect(table.fields.length).toEqual(
        document1.model?.tables[i].fields.length,
      );
      expect(table.fields.length).toEqual(
        document2.model?.tables[i].fields.length,
      );

      table.fields.forEach((field, j) => {
        expect(field.name).toEqual(
          document1.model?.tables[i].fields[j].name,
        );
        expect(field.name).toEqual(
          document2.model?.tables[i].fields[j].name,
        );

        if (i === 0) {
          expect(field.origin).toEqual(
            document1.model?.tables[i].fields[j].origin,
          );
          expect(field.origin).toEqual(
            document2.model?.tables[i].fields[j].origin,
          );

          expect(field.clause).toEqual(
            document1.model?.tables[i].fields[j].clause,
          );
          expect(field.clause).toEqual(
            document2.model?.tables[i].fields[j].clause,
          );

          expect(field.description).toEqual(
            document1.model?.tables[i].fields[j].description,
          );
          expect(field.description).toEqual(
            document2.model?.tables[i].fields[j].description,
          );

          if (j === 0) {
            expect(document1.model?.tables[i].fields[j].agg).toEqual(
              AggType.None,
            );
            expect(document2.model?.tables[i].fields[j].agg).toEqual(
              AggType.None,
            );
            expect(document1.model?.tables[i].fields[j].asc).toEqual(
              false,
            );
            expect(document2.model?.tables[i].fields[j].asc).toEqual(
              false,
            );
          }
          if (j === 1) {
            expect(document1.model?.tables[i].fields[j].agg).toEqual(
              AggType.Avg,
            );
            expect(document2.model?.tables[i].fields[j].agg).toEqual(
              AggType.Avg,
            );
            expect(document1.model?.tables[i].fields[j].asc).toEqual(
              true,
            );
            expect(document2.model?.tables[i].fields[j].asc).toEqual(
              true,
            );
          }
        }
        if (i === 1) {
          const field1 = document1.model?.tables[i].fields[j];
          const field2 = document2.model?.tables[i].fields[j];
          if (field1 && field2) {
            if (j === 0) {
              expect(field1.type?.type).toEqual(DataType.Int8);
              expect(field1.type?.options.nullable).toBeTruthy();

              expect(field2.type?.type).toEqual(DataType.Int8);
              expect(field2.type?.options.nullable).toBeTruthy();
            }
            if (j === 1) {
              expect(field1.type?.type).toEqual(DataType.Utf8);
              expect(field1.type?.options.nullable).toBeTruthy();

              expect(field2.type?.type).toEqual(DataType.Utf8);
              expect(field2.type?.options.nullable).toBeTruthy();
            }
            if (j === 2) {
              const opts1 = <DecimalOptsData>field1.type?.options;
              const opts2 = <DecimalOptsData>field2.type?.options;

              expect(field1.type?.type).toEqual(DataType.Decimal);
              expect(opts1.nullable).toBeTruthy();
              expect(opts1.scale).toEqual(10);
              expect(opts1.precision).toEqual(10);
              expect(opts1.bitWidth).toEqual(DecimalBitWidth._128);

              expect(field2.type?.type).toEqual(DataType.Decimal);
              expect(opts2.nullable).toBeTruthy();
              expect(opts2.scale).toEqual(10);
              expect(opts2.precision).toEqual(10);
              expect(opts2.bitWidth).toEqual(DecimalBitWidth._128);
            }
            if (j === 3) {
              const opts1 = <DateOptsData>field1.type?.options;
              const opts2 = <DateOptsData>field2.type?.options;

              expect(field1.type?.type).toEqual(DataType.Date);
              expect(opts1.nullable).toBeTruthy();
              expect(opts1.unit).toEqual(DateUnit.second);

              expect(field2.type?.type).toEqual(DataType.Date);
              expect(opts2.nullable).toBeTruthy();
              expect(opts2.unit).toEqual(DateUnit.second);
            }
            if (j === 4) {
              const opts1 = <TimeOptsData>field1.type?.options;
              const opts2 = <TimeOptsData>field2.type?.options;

              expect(field1.type?.type).toEqual(DataType.Time);
              expect(opts1.nullable).toBeTruthy();
              expect(opts1.unit).toEqual(TimeUnit.nanosecond);

              expect(field2.type?.type).toEqual(DataType.Time);
              expect(opts2.nullable).toBeTruthy();
              expect(opts2.unit).toEqual(TimeUnit.nanosecond);
            }
            if (j === 5) {
              const opts1 = <TimestampOptsData>field1.type?.options;
              const opts2 = <TimestampOptsData>field2.type?.options;

              expect(field1.type?.type).toEqual(DataType.Timestamp);
              expect(opts1.nullable).toBeTruthy();
              expect(opts1.unit).toEqual(TimeUnit.nanosecond);
              expect(opts1.timezone).toEqual(TimeZone.Europe_Kiev);

              expect(field2.type?.type).toEqual(DataType.Timestamp);
              expect(opts2.nullable).toBeTruthy();
              expect(opts2.unit).toEqual(TimeUnit.nanosecond);
              expect(opts2.timezone).toEqual(TimeZone.Europe_Kiev);
            }
          }
        }
      });
    });

    documentData.model?.joins.forEach((join, i) => {
      const join1 = document1.model?.joins[i];
      const join2 = document2.model?.joins[i];

      expect(join.type).toEqual(join1?.type);
      expect(join.left).toEqual(join1?.left);
      expect(join.right).toEqual(join1?.right);

      expect(join.type).toEqual(join2?.type);
      expect(join.left).toEqual(join2?.left);
      expect(join.right).toEqual(join2?.right);

      const clause = join.clause;
      const clause1 = join1?.clause;
      const clause2 = join2?.clause;

      expect(clause.type).toEqual(clause1?.type);
      expect(clause.type).toEqual(clause2?.type);

      clause.filters.forEach((filter, j) => {
        expect(filter.type).toEqual(clause1?.filters[j].type);
        expect(filter.options).toEqual(clause1?.filters[j].options);

        expect(filter.type).toEqual(clause2?.filters[j].type);
        expect(filter.options).toEqual(clause2?.filters[j].options);
      });

      const child = clause.children[0];
      const child1 = clause1?.children[0];
      const child2 = clause2?.children[0];

      expect(child.type).toEqual(child1?.type);
      expect(child.type).toEqual(child2?.type);

      child.filters.forEach((filter, j) => {
        expect(filter.type).toEqual(child1?.filters[j].type);
        expect(filter.options).toEqual(child1?.filters[j].options);

        expect(filter.type).toEqual(child2?.filters[j].type);
        expect(filter.options).toEqual(child2?.filters[j].options);
      });
    });
  });
});

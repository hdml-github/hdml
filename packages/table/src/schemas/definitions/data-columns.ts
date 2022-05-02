export default {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "data-columns",
  title: "data-columns",
  description: "HDML table data columns component.",
  type: "object",
  required: ["uid"],
  properties: {
    uid: {
      title: "uid",
      description:
        "HDML table data columns component unique identifier.",
      type: "string",
      pattern:
        "^([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]" +
        "{3}-[0-9a-f]{12})|[0-9]+$",
    },
    columns: {
      type: "array",
      items: {
        anyOf: [
          { $ref: "int-8" },
          { $ref: "int-16" },
          { $ref: "int-32" },
          { $ref: "int-64" },
          { $ref: "uint-8" },
          { $ref: "uint-16" },
          { $ref: "uint-32" },
          { $ref: "uint-64" },
          { $ref: "float-16" },
          { $ref: "float-32" },
          { $ref: "float-64" },
          { $ref: "decimal-128" },
          { $ref: "decimal-256" },
          { $ref: "date-32" },
          { $ref: "date-64" },
          { $ref: "time-32" },
          { $ref: "time-64" },
          { $ref: "time-stamp" },
          { $ref: "bit-data" },
          { $ref: "utf8-data" },
          { $ref: "binary-data" },
        ],
      },
    },
  },
};

export default {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "HDML-TABLE",
  title: "hdml-table",
  description: "HDML table component.",
  type: "object",
  required: ["uid", "name", "limit"],
  properties: {
    uid: {
      title: "uid",
      description: "HDML table unique identifier.",
      type: "string",
      pattern:
        "^([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]" +
        "{3}-[0-9a-f]{12})|[0-9]+$",
    },
    name: {
      title: "name",
      description: "HDML table name.",
      type: "string",
      pattern: "^[\\w\\-.]{1,32}",
    },
    limit: {
      title: "limit",
      description: "HDML table limit.",
      type: "integer",
      minimum: 0,
      maximum: 1000000000,
    },
    "data-columns": {
      $ref: "data-columns",
    },
  },
};

export interface HdmlTableSchema {
  uid: string;
  name: string;
  limit: number;
}

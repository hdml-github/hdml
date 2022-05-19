export default {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "decimal-256",
  title: "decimal-256",
  description: "HDML table decimal-256 field component.",
  type: "object",
  required: ["uid", "name", "nullable", "precision", "scale"],
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
      description: "Field name.",
      type: "string",
      pattern: "^[\\w\\-.]{1,64}",
    },
    nullable: {
      title: "nullable",
      description: "Nullable flag.",
      type: "boolean",
    },
    precision: {
      title: "precision",
      description: "Decimal field precision value.",
      type: "integer",
    },
    scale: {
      title: "scale",
      description: "Decimal field scale value.",
      type: "integer",
    },
  },
};

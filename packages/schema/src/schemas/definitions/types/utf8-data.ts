export default {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "utf8-data",
  title: "utf8-data",
  description: "HDML table utf8-data field component.",
  type: "object",
  required: ["uid", "name", "nullable", "large"],
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
    large: {
      title: "large",
      description: "Large utf8-data field flag.",
      type: "boolean",
    },
  },
};

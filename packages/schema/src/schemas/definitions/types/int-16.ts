export default {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "int-16",
  title: "int-16",
  description: "HDML table int-16 field component.",
  type: "object",
  required: ["uid", "name", "nullable"],
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
  },
};

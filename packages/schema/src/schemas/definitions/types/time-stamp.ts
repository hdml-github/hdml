export default {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "time-stamp",
  title: "time-stamp",
  description: "HDML table time-stamp field component.",
  type: "object",
  required: ["uid", "name", "nullable", "unit"],
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
    unit: {
      title: "unit",
      description: "Time-stamp field unit.",
      enum: ["second", "millisecond", "microsecond", "nanosecond"],
    },
    timezone: {
      title: "timezone",
      description: "Time-stamp field timezone.",
      string: "^(?:Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])$",
    },
  },
};

import { FilterOperator } from "./list.FilterOperator";
import { FilterName } from "./list.FilterName";
import { FilterType } from "./list.FilterType";

export const Expr = {
  title: "Filter expression",
  description: "Filter expression schema.",
  type: "object",
  required: ["clause"],
  properties: {
    clause: {
      title: "Clause",
      description: "Filter expression clause.",
      type: "string",
    },
  },
};

export const Keys = {
  title: "Keys filter",
  description: "Keys filter schema.",
  type: "object",
  required: ["left", "right"],
  properties: {
    left: {
      title: "Left",
      description: "Left key name.",
      type: "string",
      pattern: "^[\\w\\-.]{1,64}",
    },
    right: {
      title: "Right",
      description: "Right key name.",
      type: "string",
      pattern: "^[\\w\\-.]{1,64}",
    },
  },
};

export const Named = {
  title: "Named filter",
  description: "Named filter schema.",
  type: "object",
  required: ["name", "values"],
  properties: {
    name: {
      title: "Name",
      description: "Filter name.",
      type: "string",
      enum: FilterName,
    },
    values: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
};

export const Options = {
  title: "Filter options",
  description: "Filter options schema.",
  type: "object",
  oneOf: [Expr, Keys, Named],
};

export const Filter = {
  title: "Filter",
  description: "Filter schema.",
  type: "object",
  properties: {
    type: {
      title: "Filter type",
      description: "Filter type schema.",
      type: "string",
      enum: FilterType,
    },
    options: Options,
  },
};

export const FilterClause = {
  title: "Filter clause",
  description: "Filter clause schema.",
  type: "object",
  required: ["operator"],
  properties: {
    operator: {
      title: "Filter operator",
      description: "Filter operator schema.",
      type: "string",
      enum: FilterOperator,
    },
    filter: Filter,
    // children: [FilterClause],
  },
};

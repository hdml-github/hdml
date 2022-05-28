/**
 * @fileoverview `HdmlSchemaSchema` schema definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { namedElementSchema } from "@hdml/element";
import { metadata } from "./MetaData.schema";
import { DataFieldSchema } from "./DataField.schema";

/**
 * `HdmlSchema` element `json-schema`.
 */
export const HdmlSchemaSchema = {
  ...namedElementSchema,
  title: "HdmlSchema Element",
  description: "HdmlSchema element schema.",
  required: [...namedElementSchema.required, "fields"],
  properties: {
    ...namedElementSchema.properties,
    metadata: {
      title: "meta",
      description: "Schema meta-data.",
      type: "object",
      patternProperties: {
        "^[\\w\\-.]{1,64}": metadata,
      },
    },
    fields: {
      title: "fields",
      description: "Schema fields object.",
      type: "object",
      patternProperties: {
        "^[\\w\\-.]{1,64}": DataFieldSchema,
      },
      minProperties: 1,
    },
    index: {
      title: "index",
      description: "Schema index field.",
      type: "string",
      pattern: "^[\\w\\-.]{1,64}",
    },
  },
};

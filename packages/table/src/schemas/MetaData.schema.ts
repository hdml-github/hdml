/**
 * @fileoverview `MetaDataSchema` schema definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { namedElementSchema } from "@hdml/element";

export const metadata = {
  type: "object",
  required: [...namedElementSchema.required, "content"],
  properties: {
    ...namedElementSchema.properties,
    content: {
      title: "content",
      description: "MetaData content.",
      type: "string",
      minLength: 1,
    },
  },
};

/**
 * `MetaData` element `json-schema`.
 */
export const MetaDataSchema = {
  ...namedElementSchema,
  title: "MetaData Element",
  description: "MetaData element schema.",
  type: "object",
  required: metadata.required,
  properties: metadata.properties,
};

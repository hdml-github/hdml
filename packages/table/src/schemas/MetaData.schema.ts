/**
 * @fileoverview `MetaDataSchema` schema definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { namedElementSchema } from "@hdml/element";

/**
 * `MetaData` element `json-schema`.
 */
export const MetaDataSchema = {
  ...namedElementSchema,
  $id: "META-DATA",
  title: "MetaData Element",
  description: "MetaData element schema.",
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

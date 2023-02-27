/**
 * @fileoverview Package export.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as lit from "lit";
import { getUid } from "./helpers/index";
import {
  UnifiedElement,
  UnifiedElementSchema,
  ElementSchema,
} from "./components/UnifiedElement";
import { IoElement } from "./components/IoElement";
// import {
//   SerializableElement,
//   ElementSchema,
//   serializableElementSchema,
// } from "./components/SerializableElement";
// import {
//   NamedElement,
//   namedElementSchema,
// } from "./components/NamedElement";
// import { NameChanged } from "./events";

export {
  lit,
  getUid,
  ElementSchema,
  UnifiedElement,
  UnifiedElementSchema,
  IoElement,
  // SerializableElement,
  // NamedElement,
  // NameChanged,
  // ElementSchema,
  // serializableElementSchema,
  // namedElementSchema,
};

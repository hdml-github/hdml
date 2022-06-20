/**
 * @fileoverview Package export.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as lit from "lit";
import { elements, getUid } from "./services/index";
import { UnifiedElement } from "./components/UnifiedElement";
import {
  SerializableElement,
  ElementSchema,
  serializableElementSchema,
} from "./components/SerializableElement";
import {
  NamedElement,
  namedElementSchema,
} from "./components/NamedElement";
import { NameChanged } from "./events";

/**
 * Returns unified element by its unique identifier `element.uid`.
 */
const getElementByUid = elements.get;

export {
  lit,
  UnifiedElement,
  SerializableElement,
  NamedElement,
  NameChanged,
  ElementSchema,
  serializableElementSchema,
  namedElementSchema,
  getUid,
  getElementByUid,
};

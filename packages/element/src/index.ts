/**
 * @fileoverview Package export.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as lit from "lit";
import { Elements, getUid } from "./services/index";
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

/**
 * Returns unified element by its unique identifier `element.uid`.
 */
const getElementByUid = Elements.get;

export {
  lit,
  UnifiedElement,
  SerializableElement,
  NamedElement,
  ElementSchema,
  serializableElementSchema,
  namedElementSchema,
  getUid,
  getElementByUid,
};

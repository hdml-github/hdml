/**
 * @fileoverview Package's export.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Elements, getUid } from "./services/index";
import { UnifiedElement } from "./components/UnifiedElement";
import {
  SerializableElement,
  ElementSchema,
} from "./components/SerializableElement";

/**
 * Returns unified element by its unique identifier `element.uid`.
 */
const getElementByUid = Elements.get;

export {
  UnifiedElement,
  SerializableElement,
  ElementSchema,
  getUid,
  getElementByUid,
};

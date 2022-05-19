/**
 * @fileoverview Package's export.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Elements, getUid } from "./services/index";
import { UnifiedElement } from "./components/UnifiedElement";

/**
 * Returns unified element by its unique identifier `element.uid`.
 */
const getElementByUid = Elements.get;

export { UnifiedElement, getUid, getElementByUid };

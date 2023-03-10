/**
 * @fileoverview Declaration of the getSignature function.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { v1, v5 } from "uuid";

/**
 * Session signature symbol.
 */
export const signature = Symbol(v5(v1(), v1()).toString());

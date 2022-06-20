/**
 * @fileoverview Services index file.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { add, get, remove } from "./elements";
import { getUid } from "./getUid";

const elements = { add, get, remove };

export { getUid, elements };

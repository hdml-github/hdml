/**
 * @fileoverview Services index file.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { add, get, remove } from "./Elements";
import { getUid } from "./getUid";

const Elements = { add, get, remove };

export { getUid, Elements };

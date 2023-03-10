/**
 * @fileoverview Package export.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as lit from "lit";
import { getUid, runAttrTestSuite } from "./helpers/index";
import { UnifiedElement } from "./components/UnifiedElement";
import { HostElement } from "./components/HostElement";
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
  UnifiedElement,
  HostElement,
  runAttrTestSuite,
  // SerializableElement,
  // NamedElement,
  // NameChanged,
  // ElementSchema,
  // serializableElementSchema,
  // namedElementSchema,
};

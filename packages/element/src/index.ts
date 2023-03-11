/**
 * @fileoverview Package export.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as lit from "lit";
import { getUid } from "./helpers/getUid";
import {
  defineDefaults,
  defineHost,
  defineModel,
  getHostTag,
  getModelTag,
} from "./helpers/elementsRegister";
import { runAttrTestSuite } from "./helpers/runAttrTestSuite";
import { UnifiedElement } from "./components/UnifiedElement";
import { HostElement } from "./components/HostElement";
import { ModelElement } from "./components/ModelElement";

export {
  lit,
  getUid,
  defineDefaults,
  defineHost,
  defineModel,
  getHostTag,
  getModelTag,
  runAttrTestSuite,
  UnifiedElement,
  HostElement,
  ModelElement,
};

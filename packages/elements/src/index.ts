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
  defineIo,
  defineModel,
  defineTable,
  defineField,
  defineJoin,
  defineConnective,
  defineFilter,
  defineFrame,
  getIoTag,
  getModelTag,
  getTableTag,
  getFieldTag,
  getJoinTag,
  getConnectiveTag,
  getFilterTag,
  getFrameTag,
} from "./helpers/elementsRegister";
import { runAttrTestSuite } from "./helpers/runAttrTestSuite";
import { UnifiedElement } from "./components/UnifiedElement";
import { IoElement } from "./components/IoElement";
import { ModelElement } from "./components/ModelElement";
import { TableElement } from "./components/TableElement";
import { FieldElement } from "./components/FieldElement";
import { JoinElement } from "./components/JoinElement";
import { ConnectiveElement } from "./components/ConnectiveElement";
import { FilterElement } from "./components/FilterElement";
import { FrameElement } from "./components/FrameElement";

export {
  lit,
  // utils
  getUid,
  runAttrTestSuite,
  defineDefaults,
  // define tag name
  defineIo,
  defineModel,
  defineTable,
  defineField,
  defineJoin,
  defineConnective,
  defineFilter,
  defineFrame,
  // get tag name
  getIoTag,
  getModelTag,
  getTableTag,
  getFieldTag,
  getJoinTag,
  getConnectiveTag,
  getFilterTag,
  getFrameTag,
  // elements
  UnifiedElement,
  IoElement,
  ModelElement,
  TableElement,
  FieldElement,
  JoinElement,
  ConnectiveElement,
  FilterElement,
  FrameElement,
};

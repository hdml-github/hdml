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
  defineFilterBy,
  defineGroupBy,
  defineSortBy,
  getIoTag,
  getModelTag,
  getTableTag,
  getFieldTag,
  getJoinTag,
  getConnectiveTag,
  getFilterTag,
  getFrameTag,
  getFilterByTag,
  getGroupByTag,
  getSortByTag,
} from "./helpers/elementsRegister";
// import { runAttrTestSuite } from "./helpers/runAttrTestSuite";
import { UnifiedElement } from "./components/UnifiedElement";
import { IoElement, ElementsData } from "./components/IoElement";
import { ModelElement } from "./components/ModelElement";
import { TableElement } from "./components/TableElement";
import { FieldElement } from "./components/FieldElement";
import { JoinElement } from "./components/JoinElement";
import { ConnectiveElement } from "./components/ConnectiveElement";
import { FilterElement } from "./components/FilterElement";
import { FrameElement } from "./components/FrameElement";
import { FilterByElement } from "./components/FilterByElement";
import { GroupByElement } from "./components/GroupByElement";
import { SortByElement } from "./components/SortByElement";

export {
  lit,
  // utils
  getUid,
  // runAttrTestSuite,
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
  defineFilterBy,
  defineGroupBy,
  defineSortBy,
  // get tag name
  getIoTag,
  getModelTag,
  getTableTag,
  getFieldTag,
  getJoinTag,
  getConnectiveTag,
  getFilterTag,
  getFrameTag,
  getFilterByTag,
  getGroupByTag,
  getSortByTag,
  // elements
  UnifiedElement,
  ElementsData,
  IoElement,
  ModelElement,
  TableElement,
  FieldElement,
  JoinElement,
  ConnectiveElement,
  FilterElement,
  FrameElement,
  FilterByElement,
  GroupByElement,
  SortByElement,
};

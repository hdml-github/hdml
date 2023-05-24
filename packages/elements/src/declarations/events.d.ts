/**
 * @fileoverview Module events definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { ModelEventDetail } from "../components/ModelElement";
import { TableEventDetail } from "../components/TableElement";
import { FieldEventDetail } from "../components/FieldElement";
import { JoinEventDetail } from "../components/JoinElement";
import { ConnEventDetail } from "../components/ConnectiveElement";
import { FilterEventDetail } from "../components/FilterElement";
import { FrameEventDetail } from "../components/FrameElement";
import { FilterByEventDetail } from "../components/FilterByElement";
import { GroupByEventDetail } from "../components/GroupByElement";
import { SortByEventDetail } from "../components/SortByElement";

declare global {
  interface HTMLElementEventMap {
    "hdml-model:connected": CustomEvent<ModelEventDetail>;
    "hdml-model:changed": CustomEvent<ModelEventDetail>;
    "hdml-model:request": CustomEvent<ModelEventDetail>;
    "hdml-model:disconnected": CustomEvent<ModelEventDetail>;

    "hdml-table:connected": CustomEvent<TableEventDetail>;
    "hdml-table:changed": CustomEvent<TableEventDetail>;
    "hdml-table:disconnected": CustomEvent<TableEventDetail>;

    "hdml-field:connected": CustomEvent<FieldEventDetail>;
    "hdml-field:changed": CustomEvent<FieldEventDetail>;
    "hdml-field:disconnected": CustomEvent<FieldEventDetail>;

    "hdml-join:connected": CustomEvent<JoinEventDetail>;
    "hdml-join:changed": CustomEvent<JoinEventDetail>;
    "hdml-join:disconnected": CustomEvent<JoinEventDetail>;

    "hdml-connective:connected": CustomEvent<ConnEventDetail>;
    "hdml-connective:changed": CustomEvent<ConnEventDetail>;
    "hdml-connective:disconnected": CustomEvent<ConnEventDetail>;

    "hdml-filter:connected": CustomEvent<FilterEventDetail>;
    "hdml-filter:changed": CustomEvent<FilterEventDetail>;
    "hdml-filter:disconnected": CustomEvent<FilterEventDetail>;

    "hdml-frame:connected": CustomEvent<FrameEventDetail>;
    "hdml-frame:changed": CustomEvent<FrameEventDetail>;
    "hdml-frame:request": CustomEvent<FrameEventDetail>;
    "hdml-frame:disconnected": CustomEvent<FrameEventDetail>;

    "hdml-filter-by:connected": CustomEvent<FilterByEventDetail>;
    "hdml-filter-by:changed": CustomEvent<FilterByEventDetail>;
    "hdml-filter-by:disconnected": CustomEvent<FilterByEventDetail>;

    "hdml-group-by:connected": CustomEvent<GroupByEventDetail>;
    "hdml-group-by:changed": CustomEvent<GroupByEventDetail>;
    "hdml-group-by:disconnected": CustomEvent<GroupByEventDetail>;

    "hdml-sort-by:connected": CustomEvent<SortByEventDetail>;
    "hdml-sort-by:changed": CustomEvent<SortByEventDetail>;
    "hdml-sort-by:disconnected": CustomEvent<SortByEventDetail>;
  }
}

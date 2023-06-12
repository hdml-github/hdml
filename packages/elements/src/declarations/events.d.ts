/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { DataDetail } from "../components/IoElement";
import { ModelDetail } from "../components/ModelElement";
import { TableDetail } from "../components/TableElement";
import { FieldDetail } from "../components/FieldElement";
import { JoinDetail } from "../components/JoinElement";
import { ConnDetail } from "../components/ConnectiveElement";
import { FilterDetail } from "../components/FilterElement";
import { FrameDetail } from "../components/FrameElement";
import { FilterByDetail } from "../components/FilterByElement";
import { GroupByDetail } from "../components/GroupByElement";
import { SortByDetail } from "../components/SortByElement";

declare global {
  interface HTMLElementEventMap {
    "hdml-data": CustomEvent<DataDetail>;

    "hdml-model:connected": CustomEvent<ModelDetail>;
    "hdml-model:changed": CustomEvent<ModelDetail>;
    "hdml-model:request": CustomEvent<ModelDetail>;
    "hdml-model:disconnected": CustomEvent<ModelDetail>;

    "hdml-table:connected": CustomEvent<TableDetail>;
    "hdml-table:changed": CustomEvent<TableDetail>;
    "hdml-table:disconnected": CustomEvent<TableDetail>;

    "hdml-field:connected": CustomEvent<FieldDetail>;
    "hdml-field:changed": CustomEvent<FieldDetail>;
    "hdml-field:disconnected": CustomEvent<FieldDetail>;

    "hdml-join:connected": CustomEvent<JoinDetail>;
    "hdml-join:changed": CustomEvent<JoinDetail>;
    "hdml-join:disconnected": CustomEvent<JoinDetail>;

    "hdml-connective:connected": CustomEvent<ConnDetail>;
    "hdml-connective:changed": CustomEvent<ConnDetail>;
    "hdml-connective:disconnected": CustomEvent<ConnDetail>;

    "hdml-filter:connected": CustomEvent<FilterDetail>;
    "hdml-filter:changed": CustomEvent<FilterDetail>;
    "hdml-filter:disconnected": CustomEvent<FilterDetail>;

    "hdml-frame:connected": CustomEvent<FrameDetail>;
    "hdml-frame:changed": CustomEvent<FrameDetail>;
    "hdml-frame:request": CustomEvent<FrameDetail>;
    "hdml-frame:data": CustomEvent<FrameDetail>;
    "hdml-frame:disconnected": CustomEvent<FrameDetail>;

    "hdml-filter-by:connected": CustomEvent<FilterByDetail>;
    "hdml-filter-by:changed": CustomEvent<FilterByDetail>;
    "hdml-filter-by:disconnected": CustomEvent<FilterByDetail>;

    "hdml-group-by:connected": CustomEvent<GroupByDetail>;
    "hdml-group-by:changed": CustomEvent<GroupByDetail>;
    "hdml-group-by:disconnected": CustomEvent<GroupByDetail>;

    "hdml-sort-by:connected": CustomEvent<SortByDetail>;
    "hdml-sort-by:changed": CustomEvent<SortByDetail>;
    "hdml-sort-by:disconnected": CustomEvent<SortByDetail>;
  }
}

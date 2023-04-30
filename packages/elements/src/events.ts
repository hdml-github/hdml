/**
 * @fileoverview Module events definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { ModelEventDetail } from "./components/ModelElement";
import { TableEventDetail } from "./components/TableElement";
import { FieldEventDetail } from "./components/FieldElement";
import { JoinEventDetail } from "./components/JoinElement";
import { ConnEventDetail } from "./components/ConnectiveElement";
import { FilterEventDetail } from "./components/FilterElement";

declare global {
  interface HTMLElementEventMap {
    "hdml-model:connected": CustomEvent<ModelEventDetail>;
    "hdml-model:changed": CustomEvent<ModelEventDetail>;
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
  }
}

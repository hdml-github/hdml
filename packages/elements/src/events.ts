/**
 * @fileoverview Module events definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { ModelEventDetail } from "./components/ModelElement";
import { TableEventDetail } from "./components/TableElement";
import { FieldEventDetail } from "./components/FieldElement";

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
  }
}

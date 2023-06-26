/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Core, ElementDefinition } from "cytoscape";
import {
  ModelElement,
  TableElement,
  FieldElement,
} from "@hdml/elements";

export function getFieldsEles(
  cy: Core,
  model: ModelElement,
  table: TableElement,
): ElementDefinition[] {
  let result: ElementDefinition[] = [];
  for (const field of table.fields) {
    result = [...result, ...getFieldEles(cy, model, table, field)];
  }
  return result;
}

function getFieldEles(
  cy: Core,
  model: ModelElement,
  table: TableElement,
  field: FieldElement,
): ElementDefinition[] {
  const result: cytoscape.ElementDefinition[] = [];
  const node = cy.$id(field.uid);
  if (node.length === 0) {
    result.push({
      group: "nodes",
      classes: ["field"],
      data: {
        id: field.uid,
        name: field.data.name,
        origin: field.data.origin,
        clause: field.data.clause,
        type: field.data.type,
        agg: field.data.agg,
        asc: field.data.asc,
        element: field,
      },
    });
    result.push({
      group: "edges",
      classes: ["table-field"],
      data: {
        id: `${table.uid}-${field.uid}`,
        source: table.uid,
        target: field.uid,
      },
    });
    const cbField = (event: Event) => {
      const evt = <CustomEvent<{ field: FieldElement }>>event;
      const fld = evt.detail.field;
      if (fld.uid === field.uid) {
        table.removeEventListener("hdml-field:disconnected", cbField);
        model.removeEventListener("hdml-table:disconnected", cbTable);
        cy.$id(field.uid).remove();
      }
    };
    const cbTable = (event: Event) => {
      const evt = <CustomEvent<{ table: TableElement }>>event;
      const tbl = evt.detail.table;
      if (tbl.uid === table.uid) {
        table.removeEventListener("hdml-field:disconnected", cbField);
        model.removeEventListener("hdml-table:disconnected", cbTable);
        cy.$id(field.uid).remove();
      }
    };
    table.addEventListener("hdml-field:disconnected", cbField);
    model.addEventListener("hdml-table:disconnected", cbTable);
  } else {
    node.data("name", field.data.name);
    node.data("origin", field.data.origin);
    node.data("clause", field.data.clause);
    node.data("type", field.data.type);
    node.data("agg", field.data.agg);
    node.data("asc", field.data.asc);
  }
  return result;
}

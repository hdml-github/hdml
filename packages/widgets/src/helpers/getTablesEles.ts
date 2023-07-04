/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Core, ElementDefinition } from "cytoscape";
import { ModelElement, TableElement } from "@hdml/elements";
import { getFieldsEles } from "./getFieldsEles";
import { adjustStyles } from "./adjustStyles";

export function getTablesEles(
  cy: Core,
  model: ModelElement,
): ElementDefinition[] {
  let result: ElementDefinition[] = [];
  for (const table of model.tables) {
    result = [...result, ...getTableEles(cy, model, table)];
  }
  return result;
}

function getTableEles(
  cy: Core,
  model: ModelElement,
  table: TableElement,
): ElementDefinition[] {
  let result: ElementDefinition[] = [];
  const node = cy.$id(table.uid);
  if (node.length === 0) {
    result.push({
      group: "nodes",
      data: {
        id: table.uid,
        kind: "table",
        name: table.data.name,
        type: table.data.type,
        source: table.data.source,
        element: table,
        style: window.getComputedStyle(table),
      },
    });
    const interval = setInterval(() => {
      cy.$id(table.uid);
      adjustStyles(cy, table.uid);
    }, 200);
    const cb = (event: Event) => {
      const evt = <CustomEvent<{ table: TableElement }>>event;
      const tbl = evt.detail.table;
      if (tbl.uid === table.uid) {
        clearInterval(interval);
        cy.getElementById(tbl.uid).remove();
        model.removeEventListener("hdml-table:disconnected", cb);
      }
    };
    model.addEventListener("hdml-table:disconnected", cb);
  } else {
    node.data("name", table.data.name);
    node.data("type", table.data.type);
    node.data("source", table.data.source);
  }
  result = [...result, ...getFieldsEles(cy, model, table)];
  return result;
}

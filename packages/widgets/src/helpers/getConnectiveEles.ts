/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Core, ElementDefinition } from "cytoscape";
import { JoinElement, ConnectiveElement } from "@hdml/elements";
import { FilterOperator } from "@hdml/schema";

export function getConnectiveEles(
  cy: Core,
  parent: JoinElement | ConnectiveElement,
  clause: null | ConnectiveElement,
): ElementDefinition[] {
  let result: ElementDefinition[] = [];
  if (clause) {
    const node = cy.$id(clause.uid);
    if (node.length === 0) {
      result.push({
        group: "nodes",
        classes: ["clause"],
        data: {
          id: clause.uid,
          name: getClauseName(clause.data.type),
        },
      });
      result.push({
        group: "edges",
        classes: ["join-clause"],
        data: {
          id: `${parent.uid}-${clause.uid}`,
          source: parent.uid,
          target: clause.uid,
        },
      });
    } else {
      node.data("name", getClauseName(clause.data.type));
    }
    for (const conn of clause.connectives) {
      result = [...result, ...getConnectiveEles(cy, clause, conn)];
    }
  }
  return result;
}

function getClauseName(type: FilterOperator): string {
  switch (type) {
    case FilterOperator.Or:
      return "|";
    case FilterOperator.And:
      return "&";
    case FilterOperator.None:
      return "none";
  }
}

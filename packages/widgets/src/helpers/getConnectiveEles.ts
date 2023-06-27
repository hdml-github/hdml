/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Core, ElementDefinition } from "cytoscape";
import {
  ModelElement,
  JoinElement,
  ConnectiveElement,
} from "@hdml/elements";
import { FilterOperator } from "@hdml/schema";
import { getFilterEles } from "./getFilterEles";

export function getConnectiveEles(
  cy: Core,
  model: ModelElement,
  parent: JoinElement | ConnectiveElement,
  connective: null | ConnectiveElement,
): ElementDefinition[] {
  let result: ElementDefinition[] = [];
  if (connective) {
    const node = cy.$id(connective.uid);
    if (node.length === 0) {
      result.push({
        group: "nodes",
        classes: ["clause"],
        data: {
          id: connective.uid,
          name: getConnectiveName(connective.data.type),
          element: connective,
        },
      });
      result.push({
        group: "edges",
        classes: ["clause", "target"],
        data: {
          id: `${parent.uid}-${connective.uid}`,
          source: parent.uid,
          target: connective.uid,
        },
      });
      const cb = (event: Event) => {
        const evt = <CustomEvent<{ conn: ConnectiveElement }>>event;
        const conn = evt.detail.conn;
        if (conn.uid === connective.uid) {
          parent.removeEventListener("hdml-join:disconnected", cb);
          cy.$id(connective.uid).remove();
          cy.$id(`${parent.uid}-${connective.uid}`).remove();
        }
      };
      parent.addEventListener("hdml-connective:disconnected", cb);
    } else {
      node.data("name", getConnectiveName(connective.data.type));
    }
    for (const filter of connective.filters) {
      result = [
        ...result,
        ...getFilterEles(cy, model, parent, connective, filter),
      ];
    }
    for (const conn of connective.connectives) {
      result = [
        ...result,
        ...getConnectiveEles(cy, model, connective, conn),
      ];
    }
  }
  return result;
}

function getConnectiveName(type: FilterOperator): string {
  switch (type) {
    case FilterOperator.Or:
      return "|";
    case FilterOperator.And:
      return "&";
    case FilterOperator.None:
      return "none";
  }
}

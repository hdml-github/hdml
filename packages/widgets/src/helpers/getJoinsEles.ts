/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Core, ElementDefinition } from "cytoscape";
import {
  ModelElement,
  TableElement,
  JoinElement,
} from "@hdml/elements";
import { JoinType } from "@hdml/schema";
import { getConnectiveEles } from "./getConnectiveEles";

export function getJoinsEles(
  cy: Core,
  model: ModelElement,
): ElementDefinition[] {
  let result: ElementDefinition[] = [];
  for (const join of model.joins) {
    result = [...result, ...getJoinEles(cy, model, join)];
  }
  return result;
}

function getJoinEles(
  cy: Core,
  model: ModelElement,
  join: JoinElement,
): ElementDefinition[] {
  let result: cytoscape.ElementDefinition[] = [];
  const node = cy.$id(join.uid);
  if (node.length === 0) {
    result.push({
      group: "nodes",
      classes: ["join"],
      data: {
        id: join.uid,
        left: join.data.left,
        right: join.data.right,
        type: getJoinName(join.data.type),
        element: join,
      },
    });
    const cb = (event: Event) => {
      const evt = <CustomEvent<{ join: JoinElement }>>event;
      const jn = evt.detail.join;
      if (jn.uid === join.uid) {
        model.removeEventListener("hdml-join:disconnected", cb);
        cy.$id(join.uid).remove();
      }
    };
    model.addEventListener("hdml-join:disconnected", cb);
  } else {
    node.data("left", join.data.left);
    node.data("right", join.data.right);
    node.data("type", getJoinName(join.data.type));
  }
  result = [
    ...result,
    // ...getJoinEdgesEles(cy, model, join),
    ...getConnectiveEles(cy, model, join, join.connective),
  ];
  return result;
}

function getJoinEdgesEles(
  cy: Core,
  model: ModelElement,
  join: JoinElement,
): ElementDefinition[] {
  const result: cytoscape.ElementDefinition[] = [];
  for (const table of model.tables) {
    if (table.name === join.left || table.name === join.right) {
      const edge = cy.$id(`${join.uid}-${table.uid}`);
      if (edge.length === 0) {
        result.push({
          group: "edges",
          classes: ["join", "target"],
          data: {
            id: `${join.uid}-${table.uid}`,
            source: join.uid,
            target: table.uid,
          },
        });
        const cbJoin = (event: Event) => {
          const evt = <CustomEvent<{ join: JoinElement }>>event;
          const jn = evt.detail.join;
          if (jn.uid === join.uid) {
            cy.$id(`${join.uid}-${table.uid}`).remove();
            model.removeEventListener(
              "hdml-join:disconnected",
              cbJoin,
            );
            model.removeEventListener(
              "hdml-table:disconnected",
              cbTable,
            );
          }
        };
        const cbTable = (event: Event) => {
          const evt = <CustomEvent<{ table: TableElement }>>event;
          const tbl = evt.detail.table;
          if (tbl.uid === table.uid) {
            cy.$id(`${join.uid}-${table.uid}`).remove();
            model.removeEventListener(
              "hdml-join:disconnected",
              cbJoin,
            );
            model.removeEventListener(
              "hdml-table:disconnected",
              cbTable,
            );
          }
        };
        model.addEventListener("hdml-join:disconnected", cbJoin);
        model.addEventListener("hdml-table:disconnected", cbTable);
      }
    }
  }
  return result;
}

function getJoinName(type: JoinType): string {
  switch (type) {
    case JoinType.Cross:
      return "cross";
    case JoinType.Full:
      return "full";
    case JoinType.FullOuter:
      return "full outer";
    case JoinType.Inner:
      return "inner";
    case JoinType.Left:
      return "left";
    case JoinType.LeftOuter:
      return "left outer";
    case JoinType.Right:
      return "right";
    case JoinType.RightOuter:
      return "right outer";
  }
}

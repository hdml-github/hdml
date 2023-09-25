/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Core, ElementDefinition } from "cytoscape";
import {
  ModelElement,
  FieldElement,
  JoinElement,
  ConnectiveElement,
  FilterElement,
} from "@hdml/elements";
import { FilterType } from "@hdml/schema";

export function getFilterEles(
  cy: Core,
  model: ModelElement,
  parent: JoinElement | ConnectiveElement,
  connective: ConnectiveElement,
  filter: FilterElement,
): ElementDefinition[] {
  switch (filter.data.type) {
    case FilterType.Keys:
      return getOnFilterEles(cy, model, parent, connective, filter);
    case FilterType.Expr:
      return processFilterExpr(cy, model, parent, connective, filter);
    case FilterType.Named:
      return processFilterNamed(
        cy,
        model,
        parent,
        connective,
        filter,
      );
  }
}

function getOnFilterEles(
  cy: Core,
  model: ModelElement,
  parent: JoinElement | ConnectiveElement,
  connective: ConnectiveElement,
  filter: FilterElement,
): ElementDefinition[] {
  let result: ElementDefinition[] = [];
  const node = cy.$id(filter.uid);
  if (node.length === 0) {
    result.push({
      group: "nodes",
      classes: ["filter", getFilterName(filter.data.type)],
      data: {
        id: filter.uid,
        name: getFilterName(filter.data.type),
        element: filter,
      },
    });
    result.push({
      group: "edges",
      classes: ["filter", "target"],
      data: {
        id: `${connective.uid}-${filter.uid}`,
        source: connective.uid,
        target: filter.uid,
      },
    });
    const cb = (event: Event) => {
      const evt = <CustomEvent<{ filter: FilterElement }>>event;
      const flt = evt.detail.filter;
      if (flt.uid === filter.uid) {
        connective.removeEventListener(
          "hdml-filter:disconnected",
          cb,
        );
        cy.$id(filter.uid).remove();
        cy.$id(`${connective.uid}-${filter.uid}`).remove();
      }
    };
    connective.addEventListener("hdml-filter:disconnected", cb);
  } else {
    node.data("name", getFilterName(filter.data.type));
  }
  result = [
    ...result,
    ...getOnFilterEdgesEles(cy, model, parent, connective, filter),
  ];
  return result;
}

function getOnFilterEdgesEles(
  cy: Core,
  model: ModelElement,
  parent: JoinElement | ConnectiveElement,
  connective: ConnectiveElement,
  filter: FilterElement,
): ElementDefinition[] {
  const result: cytoscape.ElementDefinition[] = [];
  const join = getJoinElement(parent);
  if (join) {
    for (const table of model.tables) {
      if (table.name === join.left || table.name === join.right) {
        for (const field of table.fields) {
          if (
            field.data.name === filter.left ||
            field.data.name === filter.right
          ) {
            const edge = cy.$id(`${filter.uid}-${field.uid}`);
            if (edge.length === 0) {
              result.push({
                group: "edges",
                classes: ["filter", "on"],
                data: {
                  id: `${filter.uid}-${field.uid}`,
                  source: filter.uid,
                  target: field.uid,
                },
              });
              const cbFilter = (event: Event) => {
                const evt = <CustomEvent<{ filter: FilterElement }>>(
                  event
                );
                const flt = evt.detail.filter;
                if (flt.uid === filter.uid) {
                  connective.removeEventListener(
                    "hdml-filter:disconnected",
                    cbFilter,
                  );
                  table.removeEventListener(
                    "hdml-field:disconnected",
                    cbField,
                  );
                  cy.$id(`${filter.uid}-${field.uid}`).remove();
                }
              };
              const cbField = (event: Event) => {
                const evt = <CustomEvent<{ field: FieldElement }>>(
                  event
                );
                const fld = evt.detail.field;
                if (fld.uid === field.uid) {
                  connective.removeEventListener(
                    "hdml-filter:disconnected",
                    cbFilter,
                  );
                  table.removeEventListener(
                    "hdml-field:disconnected",
                    cbField,
                  );
                  cy.$id(`${filter.uid}-${field.uid}`).remove();
                }
              };
              connective.addEventListener(
                "hdml-filter:disconnected",
                cbFilter,
              );
              table.addEventListener(
                "hdml-field:disconnected",
                cbField,
              );
            }
          }
        }
      }
    }
  }
  return result;
}

function processFilterExpr(
  cy: Core,
  model: ModelElement,
  parent: JoinElement | ConnectiveElement,
  connective: ConnectiveElement,
  filter: FilterElement,
): ElementDefinition[] {
  const result: ElementDefinition[] = [];
  const node = cy.$id(filter.uid);
  if (node.length === 0) {
    result.push({
      group: "nodes",
      classes: ["filter", getFilterName(filter.data.type)],
      data: {
        id: filter.uid,
        name: filter.clause,
        element: filter,
      },
    });
    result.push({
      group: "edges",
      classes: ["filter", "target"],
      data: {
        id: `${connective.uid}-${filter.uid}`,
        source: connective.uid,
        target: filter.uid,
      },
    });
    const cb = (event: Event) => {
      const evt = <CustomEvent<{ filter: FilterElement }>>event;
      const flt = evt.detail.filter;
      if (flt.uid === filter.uid) {
        connective.removeEventListener(
          "hdml-filter:disconnected",
          cb,
        );
        cy.$id(filter.uid).remove();
        cy.$id(`${connective.uid}-${filter.uid}`).remove();
      }
    };
    connective.addEventListener("hdml-filter:disconnected", cb);
  } else {
    node.data("name", filter.clause);
  }
  return result;
}

function processFilterNamed(
  cy: Core,
  model: ModelElement,
  parent: JoinElement | ConnectiveElement,
  connective: ConnectiveElement,
  filter: FilterElement,
): ElementDefinition[] {
  const result: ElementDefinition[] = [];
  return result;
}

function getJoinElement(
  el: JoinElement | ConnectiveElement,
): JoinElement | null {
  let elm: HTMLElement | null = el;
  while (elm && !(elm instanceof JoinElement)) {
    elm = elm.parentElement;
  }
  return elm;
}

function getFilterName(type: FilterType): string {
  switch (type) {
    case FilterType.Expr:
      return "expr";
    case FilterType.Keys:
      return "on";
    case FilterType.Named:
      return "named";
  }
}

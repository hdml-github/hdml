/**
 * @fileoverview Elements register service declaration.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { IoElement } from "../components/IoElement";
import { ModelElement } from "../components/ModelElement";
import { TableElement } from "../components/TableElement";
import { FieldElement } from "../components/FieldElement";
import { JoinElement } from "../components/JoinElement";
import { ConnectiveElement } from "../components/ConnectiveElement";
import { FilterElement } from "../components/FilterElement";
import { FrameElement } from "../components/FrameElement";

/** *****************************************************************
 * IoElement - <hdml-io/>                                           *
 * ******************************************************************/

let ioDefined = false;
let ioTag = "hdml-io";

/**
 * Define `IoElement` component tag name and register custom element.
 */
export async function defineIo(
  tagName?: string,
  Constructor?: new () => IoElement,
): Promise<void> {
  if (!ioDefined) {
    ioDefined = true;
    if (tagName) {
      ioTag = tagName;
    }
    customElements.define(ioTag, Constructor || IoElement);
    await customElements.whenDefined(ioTag);
  }
}

/**
 * Returns registered `IoElement` tag name.
 */
export function getIoTag(): string {
  return ioTag;
}

/** *****************************************************************
 * ModelElement - <hdml-model/>                                     *
 * ******************************************************************/

let modelDefined = false;
let modelTag = "hdml-model";

/**
 * Define `ModelElement` component tag name and register custom
 * element.
 */
export async function defineModel(
  tagName?: string,
  Constructor?: new () => ModelElement,
): Promise<void> {
  if (!modelDefined) {
    modelDefined = true;
    if (tagName) {
      modelTag = tagName;
    }
    customElements.define(modelTag, Constructor || ModelElement);
    await customElements.whenDefined(modelTag);
  }
}

/**
 * Returns registered `ModelElement` tag name.
 */
export function getModelTag(): string {
  return modelTag;
}

/** *****************************************************************
 * TableElement - <hdml-table/>                                     *
 * ******************************************************************/

let tableDefined = false;
let tableTag = "hdml-table";

/**
 * Define `TableElement` component tag name and register custom
 * element.
 */
export async function defineTable(
  tagName?: string,
  Constructor?: new () => TableElement,
): Promise<void> {
  if (!tableDefined) {
    tableDefined = true;
    if (tagName) {
      tableTag = tagName;
    }
    customElements.define(tableTag, Constructor || TableElement);
    await customElements.whenDefined(tableTag);
  }
}

/**
 * Returns registered `TableElement` tag name.
 */
export function getTableTag(): string {
  return tableTag;
}

/** *****************************************************************
 * FieldElement - <hdml-field/>                                     *
 * ******************************************************************/

let fieldDefined = false;
let fieldTag = "hdml-field";

/**
 * Define `FieldElement` component tag name and register custom
 * element.
 */
export async function defineField(
  tagName?: string,
  Constructor?: new () => FieldElement,
): Promise<void> {
  if (!fieldDefined) {
    fieldDefined = true;
    if (tagName) {
      fieldTag = tagName;
    }
    customElements.define(fieldTag, Constructor || FieldElement);
    await customElements.whenDefined(fieldTag);
  }
}

/**
 * Returns registered `FieldElement` tag name.
 */
export function getFieldTag(): string {
  return fieldTag;
}

/** *****************************************************************
 * FieldElement - <hdml-join/>                                      *
 * ******************************************************************/

let joinDefined = false;
let joinTag = "hdml-join";

/**
 * Define `JoinElement` component tag name and register custom
 * element.
 */
export async function defineJoin(
  tagName?: string,
  Constructor?: new () => JoinElement,
): Promise<void> {
  if (!joinDefined) {
    joinDefined = true;
    if (tagName) {
      joinTag = tagName;
    }
    customElements.define(joinTag, Constructor || JoinElement);
    await customElements.whenDefined(joinTag);
  }
}

/**
 * Returns registered `JoinElement` tag name.
 */
export function getJoinTag(): string {
  return joinTag;
}

/** *****************************************************************
 * FieldElement - <hdml-connective/>                                *
 * ******************************************************************/

let connectiveDefined = false;
let connectiveTag = "hdml-connective";

/**
 * Define `ConnectiveElement` component tag name and register custom
 * element.
 */
export async function defineConnective(
  tagName?: string,
  Constructor?: new () => ConnectiveElement,
): Promise<void> {
  if (!connectiveDefined) {
    connectiveDefined = true;
    if (tagName) {
      connectiveTag = tagName;
    }
    customElements.define(
      connectiveTag,
      Constructor || ConnectiveElement,
    );
    await customElements.whenDefined(connectiveTag);
  }
}

/**
 * Returns registered `ConnectiveElement` tag name.
 */
export function getConnectiveTag(): string {
  return connectiveTag;
}

/** *****************************************************************
 * FilterElement - <hdml-filter/>                                   *
 * ******************************************************************/

let filterDefined = false;
let filterTag = "hdml-filter";

/**
 * Define `FilterElement` component tag name and register custom
 * element.
 */
export async function defineFilter(
  tagName?: string,
  Constructor?: new () => FilterElement,
): Promise<void> {
  if (!filterDefined) {
    filterDefined = true;
    if (tagName) {
      filterTag = tagName;
    }
    customElements.define(filterTag, Constructor || FilterElement);
    await customElements.whenDefined(filterTag);
  }
}

/**
 * Returns registered `FilterElement` tag name.
 */
export function getFilterTag(): string {
  return filterTag;
}

/** *****************************************************************
 * FrameElement - <hdml-frame/>                                     *
 * ******************************************************************/

let frameDefined = false;
let frameTag = "hdml-frame";

/**
 * Define `FrameElement` component tag name and register custom
 * element.
 */
export async function defineFrame(
  tagName?: string,
  Constructor?: new () => FrameElement,
): Promise<void> {
  if (!frameDefined) {
    frameDefined = true;
    if (tagName) {
      frameTag = tagName;
    }
    customElements.define(frameTag, Constructor || FrameElement);
    await customElements.whenDefined(frameTag);
  }
}

/**
 * Returns registered `FrameElement` tag name.
 */
export function getFrameTag(): string {
  return frameTag;
}

/** *****************************************************************
 * GroupByElement - <hdml-group-by/>                                *
 * ******************************************************************/

let groupDefined = false;
let groupTag = "hdml-group-by";

/**
 * Define `GroupByElement` component tag name and register custom
 * element.
 */
export async function defineGroupBy(
  tagName?: string,
  Constructor?: new () => FrameElement,
): Promise<void> {
  if (!groupDefined) {
    groupDefined = true;
    if (tagName) {
      groupTag = tagName;
    }
    customElements.define(groupTag, Constructor || FrameElement);
    await customElements.whenDefined(groupTag);
  }
}

/**
 * Returns registered `GroupByElement` tag name.
 */
export function getGroupByTag(): string {
  return groupTag;
}

/** *****************************************************************
 * SortByElement - <hdml-sort-by/>                                *
 * ******************************************************************/

let sortDefined = false;
let sortTag = "hdml-sort-by";

/**
 * Define `SortByElement` component tag name and register custom
 * element.
 */
export async function defineSortBy(
  tagName?: string,
  Constructor?: new () => FrameElement,
): Promise<void> {
  if (!sortDefined) {
    sortDefined = true;
    if (tagName) {
      sortTag = tagName;
    }
    customElements.define(sortTag, Constructor || FrameElement);
    await customElements.whenDefined(sortTag);
  }
}

/**
 * Returns registered `SortByElement` tag name.
 */
export function getSortByTag(): string {
  return sortTag;
}

/** *****************************************************************
 * Export                                                           *
 * ******************************************************************/

/**
 * Define `hdml` tags with the defaults names and components.
 */
export async function defineDefaults(): Promise<void> {
  await Promise.all([
    defineIo(),
    defineModel(),
    defineTable(),
    defineField(),
    defineJoin(),
    defineConnective(),
    defineFilter(),
    defineFrame(),
  ]);
}

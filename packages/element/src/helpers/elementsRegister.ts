/**
 * @fileoverview Elements register service declaration.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { HostElement } from "../components/HostElement";
import { ModelElement } from "../components/ModelElement";
import { TableElement } from "../components/TableElement";

let hostDefined = false;
let hostTag = "data-host";

let modelDefined = false;
let modelTag = "data-model";

let tableDefined = false;
let tableTag = "data-table";

/**
 * Define HostElement component tag name and register custom element.
 */
export async function defineHost(
  tagName?: string,
  Constructor?: new () => HostElement,
): Promise<void> {
  if (!hostDefined) {
    hostDefined = true;
    if (tagName) {
      hostTag = tagName;
    }
    customElements.define(hostTag, Constructor || HostElement);
    await customElements.whenDefined(hostTag);
  }
}

/**
 * Define ModelElement component tag name and register custom element.
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
 * Define TableElement component tag name and register custom element.
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
 * Define HDML tags with the defaults names and components.
 */
export async function defineDefaults(): Promise<void> {
  await Promise.all([defineHost(), defineModel(), defineTable()]);
}

/**
 * Returns registered HostElement tag name.
 */
export function getHostTag(): string {
  return hostTag;
}

/**
 * Returns registered ModelElement tag name.
 */
export function getModelTag(): string {
  return modelTag;
}

/**
 * Returns registered TableElement tag name.
 */
export function getTableTag(): string {
  return tableTag;
}

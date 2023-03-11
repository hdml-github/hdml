/**
 * @fileoverview Elements register service declaration.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { HostElement } from "../components/HostElement";
import { ModelElement } from "../components/ModelElement";

let hostDefined = false;
let hostTag = "data-host";

let modelDefined = false;
let modelTag = "data-model";

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
 * Define HDML tags with the defaults names and components.
 */
export async function defineDefaults(): Promise<void> {
  await Promise.all([defineHost(), defineModel()]);
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

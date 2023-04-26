/**
 * @fileoverview Elements register service declaration.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { IoElement } from "../components/IoElement";
import { ModelElement } from "../components/ModelElement";

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

/**
 * Define `hdml` tags with the defaults names and components.
 */
export async function defineDefaults(): Promise<void> {
  await Promise.all([defineIo(), defineModel()]);
}

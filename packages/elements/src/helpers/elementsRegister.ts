/**
 * @fileoverview Elements register service declaration.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { IoElement } from "../components/IoElement";

let ioDefined = false;
let ioTag = "hdml-io";

/**
 * Define IoElement component tag name and register custom element.
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
 * Define HDML tags with the defaults names and components.
 */
export async function defineDefaults(): Promise<void> {
  await Promise.all([defineIo()]);
}

/**
 * Returns registered IoElement tag name.
 */
export function getIoTag(): string {
  return ioTag;
}

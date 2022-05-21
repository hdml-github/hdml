/**
 * @fileoverview HDML elements service definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { UnifiedElement } from "../components/UnifiedElement";

/**
 * HDML elements map.
 */
export const elements: Map<string, UnifiedElement> = new Map();

/**
 * Adds specified HDML element to the map.
 */
export function add(element: UnifiedElement): void {
  elements.set(element.uid, element);
}

/**
 * Returns unified element by its unique identifier.
 */
export function get(uid: string): UnifiedElement | undefined {
  return elements.get(uid);
}

/**
 * Removes HDML element by specified uid.
 */
export function remove(element: UnifiedElement): void {
  elements.delete(element.uid);
}

/**
 * @fileoverview Elements index service definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import tablesIndex from "./tablesIndex";
import HdmlElement from "../components/HdmlElement";

/**
 * HDML elements index map.
 */
const elements: Map<string, HdmlElement> = new Map();

/**
 * Adds specified HDML element to the index map.
 */
async function addElement(element: HdmlElement): Promise<void> {
  elements.set(element.uid, element);
  switch (element.tagName) {
    case "HDML-TABLE":
      await tablesIndex.addTable(element);
      break;
    default:
      break;
  }
}

/**
 * Removes HDML element by specified uid.
 */
async function removeElement(element: HdmlElement): Promise<void> {
  switch (element.tagName) {
    case "HDML-TABLE":
      await tablesIndex.addTable(element);
      break;
    default:
      break;
  }
  elements.delete(element.uid);
}

export default {
  elements,
  addElement,
  removeElement,
};

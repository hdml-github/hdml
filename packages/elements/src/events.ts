/**
 * @fileoverview Module events definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { IModelTarget } from "./components/ModelElement";

declare global {
  interface HTMLElementEventMap {
    "hdml-model-connected": CustomEvent<IModelTarget>;
    "hdml-model-changed": CustomEvent<IModelTarget>;
    "hdml-model-disconnected": CustomEvent<IModelTarget>;
  }
}

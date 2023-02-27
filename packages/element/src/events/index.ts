/**
 * @fileoverview Module events definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/**
 * Custom `name-changed` event interface.
 */
export interface NameChanged {
  /**
   * Changed value.
   */
  val: string;

  /**
   * Old value.
   */
  old: null | string;
}

declare global {
  interface HTMLElementEventMap {
    "name-changed": CustomEvent<NameChanged>;
  }
}

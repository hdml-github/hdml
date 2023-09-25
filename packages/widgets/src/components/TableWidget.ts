/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit, TableElement } from "@hdml/elements";

export class TableWidget extends TableElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
    :host {
      display: block;
      height: 150px;
      width: 150px;
      color: black;
      font-size: 24px;
      font-weight: 600;
      font-family: 'Times New Roman', Times, serif;
      text-align: center;
      vertical-align: middle;
      border-style: solid;
      border-width: 2px;
      border-color: black;
      background-color: white;
    }
  `;
}

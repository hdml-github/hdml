/**
 * @fileoverview Module events definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { MetaData } from "./components/MetaData";
import { DataField } from "./components/DataField";

export interface MetadataConnected extends Event {
  target: MetaData;
}

export interface DatafieldConnected extends Event {
  target: DataField;
}

declare global {
  interface HTMLElementEventMap {
    "meta-data-connected": MetadataConnected;
    "data-field-connected": DatafieldConnected;
  }
}

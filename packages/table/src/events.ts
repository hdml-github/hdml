/**
 * @fileoverview Module events definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { MetaData } from "./components/MetaData";
import { DataField } from "./components/DataField";
import { HdmlSchema } from "./components/HdmlSchema";

export interface MetadataConnected extends Event {
  target: MetaData;
}
export interface MetadataChanged extends Event {
  target: MetaData;
}

export interface MetadataDisconnected extends Event {
  target: HdmlSchema | DataField;
}

export interface DatafieldConnected extends Event {
  target: DataField;
}

export interface DatafieldChanged extends Event {
  target: DataField;
}

export interface DatafieldDisconnected extends Event {
  target: HdmlSchema;
}

declare global {
  interface HTMLElementEventMap {
    "meta-data-connected": MetadataConnected;
    "meta-data-changed": MetadataChanged;
    "meta-data-disconnected": MetadataDisconnected;
    "data-field-connected": DatafieldConnected;
    "data-field-changed": DatafieldChanged;
    "data-field-disconnected": DatafieldDisconnected;
  }
}

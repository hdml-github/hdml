import { DataField } from "./components/DataField";

export interface DatafieldConnected extends Event {
  target: DataField;
}

declare global {
  interface HTMLElementEventMap {
    "data-field-connected": DatafieldConnected;
  }
}

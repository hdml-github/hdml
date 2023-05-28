import { type ModelData, type FrameData } from "@hdml/schema";
import { getModelSQL } from "./model";
import { getFrameSQL } from "./frame";

export function getSQL(document: {
  model: ModelData;
  frame?: FrameData;
}): string {
  if (!document.model) {
    throw new Error("Model is missing.");
  }
  if (document.frame) {
    return getFrameSQL(document.frame, document.model, 0);
  } else {
    return getModelSQL(document.model, 0);
  }
}

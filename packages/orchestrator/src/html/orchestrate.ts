import { type ModelData, type FrameData } from "@hdml/schema";
import { getModelHTML } from "./model";
import { getFrameHTML } from "./frame";

export function getHTML(document: {
  model: ModelData;
  frame?: FrameData;
}): string {
  if (!document.model) {
    throw new Error("Model is missing.");
  }
  if (document.frame) {
    return getFrameHTML(document.frame, document.model, 0, true);
  } else {
    return getModelHTML(document.model, 0);
  }
}

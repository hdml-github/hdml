import { type ModelData, type FrameData } from "@hdml/schema";
import { getSQL } from "./sql/orchestrate";
import { getHTML } from "./html/orchestrate";

export function orchestrate(
  document: {
    model: ModelData;
    frame?: FrameData;
  },
  toHtml = false,
): string {
  if (!toHtml) {
    return getSQL(document);
  } else {
    return getHTML(document);
  }
}
export { getSQL, getHTML };

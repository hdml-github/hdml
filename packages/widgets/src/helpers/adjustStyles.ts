/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Core, NodeSingular } from "cytoscape";

type CssStyles =
  | "display"
  | "width"
  | "height"
  | "borderWidth"
  | "borderColor"
  | "borderStyle"
  | "backgroundColor"
  | "verticalAlign"
  | "textAlign"
  | "fontSize"
  | "fontWeight"
  | "fontFamily";

type CyStyles =
  | "display"
  | "width"
  | "height"
  | "border-width"
  | "border-color"
  | "border-style"
  | "line-color"
  | "line-style"
  | "target-arrow-color"
  | "background-color"
  | "text-valign"
  | "text-halign"
  | "font-size"
  | "font-weight"
  | "font-family";

type StylesMap = {
  [key in CyStyles]?: string;
};

const CSSProps: CssStyles[] = [
  "display",
  "width",
  "height",
  "borderWidth",
  "borderColor",
  "borderStyle",
  "backgroundColor",
  "verticalAlign",
  "textAlign",
  "fontSize",
  "fontWeight",
  "fontFamily",
];

export function adjustStyles(cy: Core, uid: string): void {
  const node = cy.$id(uid);
  // applyDisplay(node);
  applySize(node);
}

function applyDisplay(node: NodeSingular): void {
  const css = <CSSStyleDeclaration>node.data("css");
  const val = css.display === "none" ? "none" : "element";
}

function applySize(node: NodeSingular): void {
  const css = <CSSStyleDeclaration>node.data("css");
  if (
    /^\d+(px)$/.test(css.width) &&
    node.style("width") !== css.width
  ) {
    node.style("width", css.width);
  }
  if (
    /^\d+(px)$/.test(css.height) &&
    node.style("height") !== css.height
  ) {
    node.style("height", css.height);
  }
}

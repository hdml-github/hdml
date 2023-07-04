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

type Kind =
  | "default"
  | "table"
  | "field"
  | "join"
  | "clause"
  | "filter_on"
  | "filter_expr";

const DefaultStyles = {
  node: {
    default: {
      display: "element",
      width: "80px",
      height: "80px",

      label: "data(name)",
      "font-size": "24px",
      "font-weight": "normal",
      "font-family": "Times New Roman",
      "text-valign": "center",
      "text-halign": "center",

      "border-width": "1px",
      "border-color": "black",
      "background-color": "white",
      "overlay-shape": "ellipse",
    },
    table: {
      width: "150px",
      height: "150px",
      "font-weight": "bold",
      "border-width": "2px",
    },
    field: {
      width: "30px",
      height: "30px",
      "font-size": "18px",
      "text-valign": "top",
      "border-width": "2px",
    },
    join: {
      label: "data(type)",
      width: "80px",
      height: "80px",
      "font-size": "18px",
    },
    clause: {
      width: "24px",
      height: "24px",
      "font-size": "18px",
    },
    filter_on: {
      width: "25px",
      height: "25px",
      "font-size": "18px",
      "border-style": "dashed",
    },
    filter_expr: {
      width: "12px",
      height: "12px",
      "background-color": "black",
      "text-valign": "bottom",
      "font-size": "18px",
    },
  },
  edge: {
    default: {
      width: "1px",
      "line-color": "black",
      "curve-style": "straight",
    },
    table: {
      //
    },
    field: {
      width: "2px",
      "line-color": "black",
    },
    join: {
      "line-style": "dashed",
    },
    clause: {
      //
    },
    filter_on: {
      "line-style": "dashed",
    },
    filter_expr: {
      //
    },
  },
  arrow: {
    default: {
      target: {
        "target-arrow-shape": "vee",
        "target-arrow-color": "black",
        "target-arrow-fill": "filled",
        "arrow-scale": 1.5,
      },
      source: {
        "source-arrow-shape": "vee",
        "source-arrow-color": "black",
        "source-arrow-fill": "filled",
        "arrow-scale": 1.5,
      },
    },
    table: {
      //
    },
    field: {
      //
    },
    join: {
      //
    },
    clause: {
      //
    },
    filter_on: {
      //
    },
    filter_expr: {
      //
    },
  },
};

export function adjustStyles(cy: Core, uid: string): void {
  const node = cy.$id(uid);
  adjustDisplay(node);
  adjustSize(node);
  adjustBox(node);
  adjustLabel(node);
}

function adjustDisplay(node: NodeSingular): void {
  const style = <CSSStyleDeclaration>node.data("style");
  const display = style.display === "none" ? "none" : "element";
  node.style("display", display);
}

function adjustSize(node: NodeSingular): void {
  const re = /^(\d+)[a-zA-Z]+$/;
  const kind = <Kind>node.data("kind");
  const style = <CSSStyleDeclaration>node.data("style");
  let width: RegExpExecArray | string | null = re.exec(style.width);
  let height: RegExpExecArray | string | null = re.exec(style.height);

  switch (kind) {
    case "table":
      if (width) {
        width = `${width[1]}px`;
      } else {
        width = DefaultStyles.node.table.width;
      }
      if (height) {
        height = `${height[1]}px`;
      } else {
        height = DefaultStyles.node.table.height;
      }
      break;
  }
  if (node.style("width") !== width) {
    node.style("width", width);
  }
  if (node.style("height") !== height) {
    node.style("height", height);
  }
}

function adjustBox(node: NodeSingular): void {
  const kind = <Kind>node.data("kind") || "default";
  const style = <CSSStyleDeclaration>node.data("style");
  const bgColorArr = style.backgroundColor.split("(");
  const bgColorType = bgColorArr[0];
  const bgColorValue = bgColorArr[1]
    .split(")")[0]
    .split(",")
    .map((e) => e.trim());
  const bgColor =
    bgColorType === "rgb" || bgColorType === "rgba"
      ? `rgb(${bgColorValue.slice(0, 3).join(", ")})`
      : "rgb(255, 255, 255)";
  const bgOpacity =
    bgColorType === "rgba" ? Number(bgColorValue[3]) : 1;

  switch (kind) {
    case "table":
      node.style(
        "border-style",
        style.borderStyle === "double"
          ? "double"
          : style.borderStyle === "dashed"
          ? "dashed"
          : style.borderStyle === "dotted"
          ? "dotted"
          : style.borderStyle === "solid"
          ? "solid"
          : undefined,
      );
      node.style("border-width", style.borderWidth);
      node.style("border-color", style.borderColor);
      node.style("background-color", bgColor);
      node.style("background-opacity", bgOpacity);
      node.style("overlay-shape", "ellipse");
      break;
  }
}

function adjustLabel(node: NodeSingular): void {
  const kind = <Kind>node.data("kind") || "default";
  const style = <CSSStyleDeclaration>node.data("style");

  switch (kind) {
    case "table":
      node.style("label", node.data("name"));
      node.style("color", style.color);
      node.style("font-size", style.fontSize);
      node.style("font-weight", style.fontWeight);
      node.style("font-family", style.fontFamily);
      node.style(
        "text-valign",
        style.verticalAlign === "top"
          ? "top"
          : style.verticalAlign === "bottom"
          ? "bottom"
          : "center",
      );
      node.style(
        "text-halign",
        style.textAlign === "left"
          ? "left"
          : style.textAlign === "right"
          ? "right"
          : "center",
      );
      break;
  }
}

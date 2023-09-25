/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export type CompletedCSSStyleSheet = CSSStyleSheet & {
  insertRule(text: string): void;
  replaceSync(text: string): void;
};

export type TrackedStyles = {
  // size
  width: number;
  height: number;

  // position
  top: number;
  left: number;

  // paddings
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;

  // cursor
  cursor: string;

  // line width
  lineWidth: number;
  lineWidthActive: number;
  lineWidthFocus: number;
  lineWidthHover: number;

  // line color
  lineColor: string;
  lineColorActive: string;
  lineColorFocus: string;
  lineColorHover: string;

  // line style
  lineStyle: string;
  lineStyleActive: string;
  lineStyleFocus: string;
  lineStyleHover: string;

  // fill color (background)
  fillColor: string;
  fillColorActive: string;
  fillColorFocus: string;
  fillColorHover: string;

  // font family
  fontFamily: string;
  fontFamilyActive: string;
  fontFamilyFocus: string;
  fontFamilyHover: string;

  // font size
  fontSize: string;
  fontSizeActive: string;
  fontSizeFocus: string;
  fontSizeHover: string;

  // font weight
  fontWeight: string;
  fontWeightActive: string;
  fontWeightFocus: string;
  fontWeightHover: string;

  // font style
  fontStyle: string;
  fontStyleActive: string;
  fontStyleFocus: string;
  fontStyleHover: string;

  tickStyle: "text" | "rect" | "ellipse";
  tickWidth: number;
  tickHeight: number;
  curveType:
    | "natural"
    | "linear"
    | "cubic"
    | "step"
    | "bezier"
    | "basis"
    | "cardinal"
    | "catmull-rom";
  curveBasisBeta: number /* 0..1 */;
  curveBezierTangents: "horizontal" | "vertical";
  curveCardinalTension: number /* 0..1 */;
  curveCatmullRomAlpha: number /* 0..1 */;
  curveCubicMonotonicity: "x" | "y";
  curveStepChange: "before" | "middle" | "after";
};

/**
 * Updates stylesheet rules based on the components styles.
 */
export function updateStyles(
  component: Element & { tracked: TrackedStyles },
  stylesheet: CompletedCSSStyleSheet,
  selector: string,
): void {
  const styles = getSvgStyles(component, selector);
  for (let i = stylesheet.cssRules.length - 1; i >= 0; i--) {
    stylesheet.deleteRule(i);
  }
  styles.forEach((rule: string) => {
    stylesheet.insertRule(rule);
  });
}

function getSvgStyles(
  component: Element & { tracked: TrackedStyles },
  selector: string,
): string[] {
  const def = getSvgSelectorStyles(component, selector);
  const act = getSvgSelectorStyles(component, selector, "active");
  const foc = getSvgSelectorStyles(component, selector, "focus");
  const hov = getSvgSelectorStyles(component, selector, "hover");
  return [def, act, foc, hov];
}

function getSvgSelectorStyles(
  component: Element & { tracked: TrackedStyles },
  selector: string,
  state?: "hover" | "focus" | "active",
): string {
  switch (state) {
    case undefined:
      return (
        `${selector} {\n` +
        `\t${getSvgFillStyle(component.tracked)}\n` +
        `\t${getSvgStrokeStyle(component.tracked)}\n` +
        `\t${getSvgStrokeWidthStyle(component.tracked)}\n` +
        `\t${getSvgStrokeDasharrayStyle(component.tracked)}\n` +
        `\t${getSvgStrokeLinecapStyle(component.tracked)}\n` +
        `\t${getSvgCursorStyle(component.tracked)}\n` +
        `\t${getSvgOutlineStyle()}\n` +
        `\t${getSvgFontFamilyStyle(component.tracked)}\n` +
        `\t${getSvgFontSizeStyle(component.tracked)}\n` +
        `\t${getSvgFontWeightStyle(component.tracked)}\n` +
        `\t${getSvgFontStyleStyle(component.tracked)}\n` +
        `}`
      );
    case "active":
      return (
        `${selector}:active {\n` +
        `\t${getSvgStrokeWidthStyle(component.tracked, "active")}\n` +
        `\t${getSvgStrokeStyle(component.tracked, "active")}\n` +
        `\t${getSvgStrokeDasharrayStyle(
          component.tracked,
          "active",
        )}\n` +
        `\t${getSvgFillStyle(component.tracked, "active")}\n` +
        `\t${getSvgFontFamilyStyle(component.tracked, "active")}\n` +
        `\t${getSvgFontSizeStyle(component.tracked, "active")}\n` +
        `\t${getSvgFontWeightStyle(component.tracked, "active")}\n` +
        `\t${getSvgFontStyleStyle(component.tracked, "active")}\n` +
        `}`
      );
    case "focus":
      return (
        `${selector}:focus {\n` +
        `\t${getSvgStrokeWidthStyle(component.tracked, "focus")}\n` +
        `\t${getSvgStrokeStyle(component.tracked, "focus")}\n` +
        `\t${getSvgStrokeDasharrayStyle(
          component.tracked,
          "focus",
        )}\n` +
        `\t${getSvgFillStyle(component.tracked, "focus")}\n` +
        `\t${getSvgFontFamilyStyle(component.tracked, "focus")}\n` +
        `\t${getSvgFontSizeStyle(component.tracked, "focus")}\n` +
        `\t${getSvgFontWeightStyle(component.tracked, "focus")}\n` +
        `\t${getSvgFontStyleStyle(component.tracked, "focus")}\n` +
        `}`
      );
    case "hover":
      return (
        `${selector}:hover {\n` +
        `\t${getSvgStrokeWidthStyle(component.tracked, "hover")}\n` +
        `\t${getSvgStrokeStyle(component.tracked, "hover")}\n` +
        `\t${getSvgStrokeDasharrayStyle(
          component.tracked,
          "hover",
        )}\n` +
        `\t${getSvgFillStyle(component.tracked, "hover")}\n` +
        `\t${getSvgFontFamilyStyle(component.tracked, "hover")}\n` +
        `\t${getSvgFontSizeStyle(component.tracked, "hover")}\n` +
        `\t${getSvgFontWeightStyle(component.tracked, "hover")}\n` +
        `\t${getSvgFontStyleStyle(component.tracked, "hover")}\n` +
        `}`
      );
  }
}

function getSvgCursorStyle(tracked: TrackedStyles): string {
  return `cursor: ${tracked.cursor};`;
}

function getSvgOutlineStyle(): string {
  return "outline: none;";
}

function getSvgFontFamilyStyle(
  tracked: TrackedStyles,
  state?: "hover" | "focus" | "active",
): string {
  switch (state) {
    case undefined:
      return `font-family: ${tracked.fontFamily};`;
    case "active":
      return `font-family: ${tracked.fontFamilyActive};`;
    case "focus":
      return `font-family: ${tracked.fontFamilyFocus};`;
    case "hover":
      return `font-family: ${tracked.fontFamilyHover};`;
  }
}

function getSvgFontSizeStyle(
  tracked: TrackedStyles,
  state?: "hover" | "focus" | "active",
): string {
  switch (state) {
    case undefined:
      return `font-size: ${tracked.fontSize};`;
    case "active":
      return `font-size: ${tracked.fontSizeActive};`;
    case "focus":
      return `font-size: ${tracked.fontSizeFocus};`;
    case "hover":
      return `font-size: ${tracked.fontSizeHover};`;
  }
}

function getSvgFontWeightStyle(
  tracked: TrackedStyles,
  state?: "hover" | "focus" | "active",
): string {
  switch (state) {
    case undefined:
      return `font-weight: ${tracked.fontWeight};`;
    case "active":
      return `font-weight: ${tracked.fontWeightActive};`;
    case "focus":
      return `font-weight: ${tracked.fontWeightFocus};`;
    case "hover":
      return `font-weight: ${tracked.fontWeightHover};`;
  }
}

function getSvgFontStyleStyle(
  tracked: TrackedStyles,
  state?: "hover" | "focus" | "active",
): string {
  switch (state) {
    case undefined:
      return `font-style: ${tracked.fontStyle};`;
    case "active":
      return `font-style: ${tracked.fontStyleActive};`;
    case "focus":
      return `font-style: ${tracked.fontStyleFocus};`;
    case "hover":
      return `font-style: ${tracked.fontStyleHover};`;
  }
}

function getSvgStrokeStyle(
  tracked: TrackedStyles,
  state?: "hover" | "focus" | "active",
): string {
  switch (state) {
    case undefined:
      return `stroke: ${tracked.lineColor};`;
    case "active":
      return `stroke: ${tracked.lineColorActive};`;
    case "focus":
      return `stroke: ${tracked.lineColorFocus};`;
    case "hover":
      return `stroke: ${tracked.lineColorHover};`;
  }
}

function getSvgStrokeWidthStyle(
  tracked: TrackedStyles,
  state?: "hover" | "focus" | "active",
): string {
  if (
    tracked.lineStyle === "solid" ||
    tracked.lineStyle === "dashed" ||
    tracked.lineStyle === "dotted"
  ) {
    switch (state) {
      case undefined:
        return `stroke-width: ${tracked.lineWidth};`;
      case "active":
        return `stroke-width: ${tracked.lineWidthActive};`;
      case "focus":
        return `stroke-width: ${tracked.lineWidthFocus};`;
      case "hover":
        return `stroke-width: ${tracked.lineWidthHover};`;
    }
  } else {
    return "stroke-width: 0;";
  }
}

function getSvgStrokeDasharrayStyle(
  tracked: TrackedStyles,
  state?: "hover" | "focus" | "active",
): string {
  let lineStyle: string;
  let lineWidth: number;
  switch (state) {
    case undefined:
      lineStyle = tracked.lineStyle;
      lineWidth = tracked.lineWidth;
      break;
    case "active":
      lineStyle = tracked.lineStyleActive;
      lineWidth = tracked.lineWidthActive;
      break;
    case "focus":
      lineStyle = tracked.lineStyleFocus;
      lineWidth = tracked.lineWidthFocus;
      break;
    case "hover":
      lineStyle = tracked.lineStyleHover;
      lineWidth = tracked.lineWidthHover;
      break;
  }
  if (lineStyle === "solid") {
    return `stroke-dasharray: none;`;
  } else if (lineStyle === "dashed") {
    return (
      `stroke-dasharray: ` +
      `${2 * lineWidth + 1},` +
      `${lineWidth + 1};`
    );
  } else if (lineStyle === "dotted") {
    return `stroke-dasharray: 0, ${2 * lineWidth};`;
  } else {
    return `stroke-dasharray: none;`;
  }
}

function getSvgStrokeLinecapStyle(tracked: TrackedStyles): string {
  if (tracked.lineStyle === "solid") {
    return `stroke-linecap: inherit;`;
  } else if (tracked.lineStyle === "dashed") {
    return `stroke-linecap: inherit;`;
  } else if (tracked.lineStyle === "dotted") {
    return `stroke-linecap: round;`;
  } else {
    return `stroke-linecap: inherit;`;
  }
}

function getSvgFillStyle(
  tracked: TrackedStyles,
  state?: "hover" | "focus" | "active",
): string {
  switch (state) {
    case undefined:
      return `fill: ${tracked.fillColor};`;
    case "active":
      return `fill: ${tracked.fillColorActive};`;
    case "focus":
      return `fill: ${tracked.fillColorFocus};`;
    case "hover":
      return `fill: ${tracked.fillColorHover};`;
  }
}

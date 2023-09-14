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
  width: number;
  height: number;
  top: number;
  left: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  cursor: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: string;
  color: string;

  // line width
  lineWidth: number;
  lineWidthActive: number;
  lineWidthFocus: number;
  lineWidthHover: number;

  lineColor: string;
  lineStyle: string;

  fillColor: string;
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
        `\t${getSvgFontColorStyle(component.tracked)}\n` +
        `}`
      );
    case "active":
      return (
        `${selector}:active {\n` +
        `\t${getSvgStrokeWidthStyle(component.tracked, "active")}\n` +
        `}`
      );
    case "focus":
      return (
        `${selector}:focus {\n` +
        `\t${getSvgStrokeWidthStyle(component.tracked, "focus")}\n` +
        `}`
      );
    case "hover":
      return (
        `${selector}:hover {\n` +
        `\t${getSvgStrokeWidthStyle(component.tracked, "hover")}\n` +
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

function getSvgFontFamilyStyle(tracked: TrackedStyles): string {
  return `font-family: ${tracked.fontFamily};`;
}

function getSvgFontSizeStyle(tracked: TrackedStyles): string {
  return `font-size: ${tracked.fontSize}px;`;
}

function getSvgFontWeightStyle(tracked: TrackedStyles): string {
  return `font-weight: ${tracked.fontWeight};`;
}

function getSvgFontStyleStyle(tracked: TrackedStyles): string {
  return `font-style: ${tracked.fontStyle};`;
}

function getSvgFontColorStyle(tracked: TrackedStyles): string {
  return `color: ${tracked.color};`;
}

function getSvgStrokeStyle(tracked: TrackedStyles): string {
  return `stroke: ${tracked.lineColor};`;
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

function getSvgStrokeDasharrayStyle(tracked: TrackedStyles): string {
  if (tracked.lineStyle === "solid") {
    return `stroke-dasharray: none;`;
  } else if (tracked.lineStyle === "dashed") {
    return (
      `stroke-dasharray: ` +
      `${2 * tracked.lineWidth + 1},` +
      `${tracked.lineWidth + 1};`
    );
  } else if (tracked.lineStyle === "dotted") {
    return `stroke-dasharray: 0, ${2 * tracked.lineWidth};`;
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

function getSvgFillStyle(tracked: TrackedStyles): string {
  return `fill: ${tracked.fillColor};`;
}

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export type TrackedStyles = {
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  borderColor: string;
  borderStyle: string;
  borderWidth: number;
  cursor: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: string;
  color: string;
};

/**
 * Reset stylesheet rules based on the components styles.
 */
export function resetStylesheet(
  component: Element & { tracked: TrackedStyles },
  stylesheet: CSSStyleSheet,
  selector: string,
): void {
  const styles = getSvgStyles(component, selector);
  for (let i = stylesheet.cssRules.length - 1; i >= 0; i--) {
    stylesheet.deleteRule(i);
  }
  styles.forEach((rule: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    stylesheet.insertRule(rule);
  });
}

function getSvgStyles(
  component: Element & { tracked: TrackedStyles },
  selector: string,
): string[] {
  const def = getSvgSelectorStyles(component, selector);
  const hov = getSvgSelectorStyles(component, selector, "hover");
  const foc = getSvgSelectorStyles(component, selector, "focus");
  const act = getSvgSelectorStyles(component, selector, "active");
  return [act, foc, hov, def];
}

function getSvgSelectorStyles(
  component: Element & { tracked: TrackedStyles },
  selector: string,
  state?: "hover" | "focus" | "active",
): string {
  state && component.classList.add(state);
  const val =
    `${selector}${state ? `:${state}` : ""} {\n` +
    `\t${getSvgStrokeStyle(component.tracked)}\n` +
    `\t${getSvgStrokeWidthStyle(component.tracked)}\n` +
    `\t${getSvgStrokeDasharrayStyle(component.tracked)}\n` +
    `\t${getSvgStrokeLinecapStyle(component.tracked)}\n` +
    `\t${getSvgCursorStyle(component.tracked)}\n` +
    `\t${getSvgOutlineStyle(component.tracked)}\n` +
    `\t${getSvgFontFamilyStyle(component.tracked)}\n` +
    `\t${getSvgFontSizeStyle(component.tracked)}\n` +
    `\t${getSvgFontWeightStyle(component.tracked)}\n` +
    `\t${getSvgFontStyleStyle(component.tracked)}\n` +
    `\t${getSvgFontColorStyle(component.tracked)}\n` +
    `}`;
  state && component.classList.remove(state);
  return val;
}

function getSvgStrokeStyle(tracked: TrackedStyles): string {
  return `stroke: ${tracked.borderColor};`;
}

function getSvgStrokeWidthStyle(tracked: TrackedStyles): string {
  if (
    tracked.borderStyle === "solid" ||
    tracked.borderStyle === "dashed" ||
    tracked.borderStyle === "dotted"
  ) {
    return `stroke-width: ${tracked.borderWidth};`;
  } else {
    return "stroke-width: 0;";
  }
}

function getSvgStrokeDasharrayStyle(tracked: TrackedStyles): string {
  if (tracked.borderStyle === "solid") {
    return `stroke-dasharray: none;`;
  } else if (tracked.borderStyle === "dashed") {
    return (
      `stroke-dasharray: ` +
      `${2 * tracked.borderWidth + 1},` +
      `${tracked.borderWidth + 1};`
    );
  } else if (tracked.borderStyle === "dotted") {
    return `stroke-dasharray: 0, ${2 * tracked.borderWidth};`;
  } else {
    return `stroke-dasharray: none;`;
  }
}

function getSvgStrokeLinecapStyle(tracked: TrackedStyles): string {
  if (tracked.borderStyle === "solid") {
    return `stroke-linecap: inherit;`;
  } else if (tracked.borderStyle === "dashed") {
    return `stroke-linecap: inherit;`;
  } else if (tracked.borderStyle === "dotted") {
    return `stroke-linecap: round;`;
  } else {
    return `stroke-linecap: inherit;`;
  }
}

function getSvgCursorStyle(tracked: TrackedStyles): string {
  return `cursor: ${tracked.cursor};`;
}

function getSvgOutlineStyle(tracked: TrackedStyles): string {
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

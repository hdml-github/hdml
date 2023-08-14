/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit, UnifiedElement } from "@hdml/elements";
import { HdmlViewElement } from "./HdmlViewElement";

type TrackedStyles = {
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

export abstract class AbstractChartElement extends UnifiedElement {
  private _svgCSSSheet = new CSSStyleSheet();
  private _styles = window.getComputedStyle(this);
  private _stored: TrackedStyles = {
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    borderColor: "rgba(0, 0, 0, 0)",
    borderStyle: "none",
    borderWidth: 0,
    cursor: "auto",
    fontFamily: "Times New Roman",
    fontSize: 0,
    fontWeight: 0,
    fontStyle: "normal",
    color: "rgba(0, 0, 0, 0)",
  };

  /**
   * The plane associated with the scale.
   */
  public get view(): null | HdmlViewElement {
    if (this instanceof HdmlViewElement) {
      return this;
    }
    let cnt = 1;
    let parent: null | HTMLElement | HdmlViewElement =
      this.parentElement;
    while (parent && cnt <= 25) {
      if (parent instanceof HdmlViewElement) {
        return parent;
      } else {
        cnt++;
        parent = parent.parentElement;
      }
    }
    return null;
  }

  /**
   * Computed styles of the component.
   */
  public get styles(): CSSStyleDeclaration {
    return this._styles;
  }

  /**
   * Tracked component styles.
   */
  public get tracked(): TrackedStyles {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    return {
      get width(): number {
        return parseFloat(self.styles.width);
      },
      get height(): number {
        return parseFloat(self.styles.height);
      },
      get top(): number {
        return parseFloat(self.styles.top);
      },
      get right(): number {
        return parseFloat(self.styles.right);
      },
      get bottom(): number {
        return parseFloat(self.styles.bottom);
      },
      get left(): number {
        return parseFloat(self.styles.left);
      },
      get paddingTop(): number {
        return parseFloat(self.styles.paddingTop);
      },
      get paddingRight(): number {
        return parseFloat(self.styles.paddingRight);
      },
      get paddingBottom(): number {
        return parseFloat(self.styles.paddingBottom);
      },
      get paddingLeft(): number {
        return parseFloat(self.styles.paddingLeft);
      },
      get borderColor(): string {
        return self.styles.borderColor;
      },
      get borderStyle(): string {
        return self.styles.borderStyle;
      },
      get borderWidth(): number {
        return parseFloat(self.styles.borderWidth);
      },
      get cursor(): string {
        return self.styles.cursor;
      },
      get fontFamily(): string {
        return self.styles.fontFamily;
      },
      get fontSize(): number {
        return parseFloat(self.styles.fontSize);
      },
      get fontWeight(): number {
        return parseFloat(self.styles.fontWeight);
      },
      get fontStyle(): string {
        return self.styles.fontStyle;
      },
      get color(): string {
        return self.styles.color;
      },
    };
  }

  /**
   * Stored component styles.
   */
  public get stored(): TrackedStyles {
    return this._stored;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener(
      "styles-changed",
      this.stylesChangedListener,
    );
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener(
      "styles-changed",
      this.stylesChangedListener,
    );
    this.view?.removeStylesheet(this._svgCSSSheet);
  }

  /**
   * The `window` `styles-changed` event listener. Runs the
   * `requestUpdate` method passing the "styles-changed" string as a
   * property key.
   */
  private stylesChangedListener = () => {
    this.requestUpdate();
  };

  /**
   * @override
   */
  public shouldUpdate(): boolean {
    const props = <(keyof TrackedStyles)[]>Object.keys(this._stored);
    const changed = props.filter((prop) => {
      const p = prop;
      return this._stored[p] !== this.tracked[p];
    });
    return !!changed.length;
  }

  /**
   * @override
   */
  protected firstUpdated(
    changedProperties: Map<PropertyKey, unknown>,
  ): void {
    super.firstUpdated(changedProperties);
  }

  /**
   * @override
   */
  protected updated(changed: Map<string, unknown>): void {
    const props = <(keyof TrackedStyles)[]>Object.keys(this._stored);
    props.forEach((p) => {
      this._stored[p] = <never>this.tracked[p];
    });
    super.updated(changed);
    this.dispatchEvent(
      new CustomEvent("updated", {
        cancelable: false,
        composed: false,
        bubbles: false,
      }),
    );
  }

  /**
   * Callback to run when the tracked styles have been changed.
   */
  protected abstract trackedStylesChanged(): void;

  /**
   * Renders `svg`-elements in the `hdml-view` shadow `DOM` and
   * dispatches `svg-rendered` event when the job was done.
   *
   * ```ts
   * renderSvgElements() {
   *   // render svg logic
   *   super.renderSvgElements();
   * }
   * ```
   */
  protected renderSvgElements(): void {
    this.dispatchEvent(
      new CustomEvent("svg-rendered", {
        cancelable: false,
        composed: false,
        bubbles: false,
      }),
    );
  }

  /**
   * Resets component shadow `DOM` stylesheets.
   *
   * ```ts
   * resetShadowStylesheets() {
   *   super.resetShadowStylesheets(`:host > svg g`);
   * }
   * ```
   */
  protected resetShadowStylesheets(sheets: CSSStyleSheet[]): void {
    lit.adoptStyles(<ShadowRoot>this.renderRoot, [
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <{ styleSheet: CSSStyleSheet }>this.constructor.styles,
      ...sheets,
    ]);
  }

  /**
   * Attaches the component `svg` elements `css` stylesheet to the
   * `hdml-view` `ShadowDOM`.
   */
  protected updateSvgStyles(selector: string): void {
    if (this.view) {
      this.view?.addStylesheet(this._svgCSSSheet);
      const [def, hov, foc, act] = this.getSvgStyles(selector);
      for (
        let i = this._svgCSSSheet.cssRules.length - 1;
        i >= 0;
        i--
      ) {
        this._svgCSSSheet.deleteRule(i);
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this._svgCSSSheet.insertRule(act);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this._svgCSSSheet.insertRule(foc);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this._svgCSSSheet.insertRule(hov);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this._svgCSSSheet.insertRule(def);
    }
  }

  private getSvgStyles(selector: string): string[] {
    const def = this.getSvgSelectorStyles(selector);
    const hov = this.getSvgSelectorStyles(selector, "hover");
    const foc = this.getSvgSelectorStyles(selector, "focus");
    const act = this.getSvgSelectorStyles(selector, "active");
    return [def, hov, foc, act];
  }

  private getSvgSelectorStyles(
    selector: string,
    state?: "hover" | "focus" | "active",
  ): string {
    state && this.classList.add(state);
    const val =
      `${selector}${state ? `:${state}` : ""} {\n` +
      `\t${this.getSvgStrokeStyle()}\n` +
      `\t${this.getSvgStrokeWidthStyle()}\n` +
      `\t${this.getSvgStrokeDasharrayStyle()}\n` +
      `\t${this.getSvgStrokeLinecapStyle()}\n` +
      `\t${this.getSvgCursorStyle()}\n` +
      `\t${this.getSvgOutlineStyle()}\n` +
      `\t${this.getSvgFontFamilyStyle()}\n` +
      `\t${this.getSvgFontSizeStyle()}\n` +
      `\t${this.getSvgFontWeightStyle()}\n` +
      `\t${this.getSvgFontStyleStyle()}\n` +
      `\t${this.getSvgFontColorStyle()}\n` +
      `}`;
    state && this.classList.remove(state);
    return val;
  }

  private getSvgStrokeStyle(): string {
    return `stroke: ${this.tracked.borderColor};`;
  }

  private getSvgStrokeWidthStyle(): string {
    if (
      this.tracked.borderStyle === "solid" ||
      this.tracked.borderStyle === "dashed" ||
      this.tracked.borderStyle === "dotted"
    ) {
      return `stroke-width: ${this.tracked.borderWidth};`;
    } else {
      return "stroke-width: 0;";
    }
  }

  private getSvgStrokeDasharrayStyle(): string {
    if (this.tracked.borderStyle === "solid") {
      return `stroke-dasharray: none;`;
    } else if (this.tracked.borderStyle === "dashed") {
      return (
        `stroke-dasharray: ` +
        `${2 * this.tracked.borderWidth + 1},` +
        `${this.tracked.borderWidth + 1};`
      );
    } else if (this.tracked.borderStyle === "dotted") {
      return `stroke-dasharray: 0, ${2 * this.tracked.borderWidth};`;
    } else {
      return `stroke-dasharray: none;`;
    }
  }

  private getSvgStrokeLinecapStyle(): string {
    if (this.tracked.borderStyle === "solid") {
      return `stroke-linecap: inherit;`;
    } else if (this.tracked.borderStyle === "dashed") {
      return `stroke-linecap: inherit;`;
    } else if (this.tracked.borderStyle === "dotted") {
      return `stroke-linecap: round;`;
    } else {
      return `stroke-linecap: inherit;`;
    }
  }

  private getSvgCursorStyle(): string {
    return `cursor: ${this.tracked.cursor};`;
  }

  private getSvgOutlineStyle(): string {
    return "outline: none;";
  }

  private getSvgFontFamilyStyle(): string {
    return `font-family: ${this.tracked.fontFamily};`;
  }

  private getSvgFontSizeStyle(): string {
    return `font-size: ${this.tracked.fontSize}px;`;
  }

  private getSvgFontWeightStyle(): string {
    return `font-weight: ${this.tracked.fontWeight};`;
  }

  private getSvgFontStyleStyle(): string {
    return `font-style: ${this.tracked.fontStyle};`;
  }

  private getSvgFontColorStyle(): string {
    return `color: ${this.tracked.color};`;
  }
}

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
};

export class BaseChartElement extends UnifiedElement {
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
    window.removeEventListener(
      "styles-changed",
      this.stylesChangedListener,
    );
    this.view?.removeStylesheet(this._svgCSSSheet);
    super.disconnectedCallback();
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
    super.update(changed);
  }

  /**
   * The `window` `styles-changed` event listener. Consequently
   * dispatches the `styles-changed` event if element's styles were
   * updated.
   */
  private stylesChangedListener = () => {
    const props = <(keyof TrackedStyles)[]>Object.keys(this._stored);
    const changed = props.filter((prop) => {
      const p = prop;
      return this._stored[p] !== this.tracked[p];
    });
    if (changed.length) {
      this.trackedStylesChanged();
      changed.forEach((p) => {
        // TODO: wtf with the types here?
        this._stored[p] = <never>this.tracked[p];
      });
      this.dispatchEvent(
        new CustomEvent("styles-changed", {
          cancelable: false,
          composed: false,
          bubbles: false,
        }),
      );
    }
  };

  /**
   * Callback to run when the tracked styles have been changed.
   */
  protected trackedStylesChanged(): void {
    //
  }

  /**
   * Renders `SVG`-elements in the `hdml-view` shadow `DOM` and
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
   * Updates the `CSS` stylesheet for the `SVG` elements.
   *
   * ```ts
   * resetShadowStylesheets() {
   *   super.resetShadowStylesheets(`:host > svg g`);
   * }
   * ```
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
}

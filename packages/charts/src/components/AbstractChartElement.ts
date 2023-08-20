/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit, UnifiedElement } from "@hdml/elements";
import { HdmlViewElement } from "./HdmlViewElement";
import {
  TrackedStyles,
  resetStylesheet,
} from "../helpers/resetStylesheet";

export abstract class AbstractChartElement extends UnifiedElement {
  private _view: null | HdmlViewElement = null;
  private _ssheet = new CSSStyleSheet();
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
    lineColor: "rgba(0, 0, 0, 0)",
    lineStyle: "solid",
    lineWidth: 0,
    cursor: "auto",
    fontFamily: "Times New Roman",
    fontSize: 0,
    fontWeight: 0,
    fontStyle: "normal",
    color: "rgba(0, 0, 0, 0)",
  };

  /**
   * Component geometry selector.
   */
  protected abstract geometrySelector: null | string;

  /**
   * Associated `hdml-view` element if exist or `null` otherwise.
   */
  public get view(): null | HdmlViewElement {
    if (!this._view) {
      if (this instanceof HdmlViewElement) {
        this._view = this;
      }
      let cnt = 1;
      let parent: null | HTMLElement | HdmlViewElement =
        this.parentElement;
      while (parent && cnt <= 25) {
        if (parent instanceof HdmlViewElement) {
          this._view = parent;
          break;
        } else {
          cnt++;
          parent = parent.parentElement;
        }
      }
    }
    return this._view;
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
      get lineColor(): string {
        return (
          self.styles.getPropertyValue("--hdml-line-color") ||
          "rgba(0, 0, 0, 0)"
        );
      },
      get lineStyle(): string {
        return (
          self.styles.getPropertyValue("--hdml-line-style") || "solid"
        );
      },
      get lineWidth(): number {
        return (
          parseFloat(
            self.styles.getPropertyValue("--hdml-line-width"),
          ) || 0
        );
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
    this.requestUpdate("_force", true);
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
    // TODO: what should we do with this?
    this._view?.removeStylesheet(this._ssheet);
    this._view = null;
  }

  /**
   * @override
   */
  public shouldUpdate(
    changedProperties: Map<string, unknown>,
  ): boolean {
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
    this.renderGeometry();
  }

  /**
   * @override
   */
  protected updated(changed: Map<string, unknown>): void {
    this.updateStyles();
    this.updateGeometry();
    this.dispatchEvent(
      new CustomEvent("updated", {
        cancelable: false,
        composed: false,
        bubbles: false,
      }),
    );
  }

  /**
   * Resets component shadow `DOM` stylesheets.
   */
  protected resetStylesheets(sheets: CSSStyleSheet[]): void {
    lit.adoptStyles(<ShadowRoot>this.renderRoot, [
      this.getStaticStyles(),
      ...sheets,
    ]);
  }

  /**
   * Updates component stylesheet rules.
   */
  protected updateStyles(): void {
    const props = <(keyof TrackedStyles)[]>Object.keys(this._stored);
    props.forEach((p) => {
      this._stored[p] = <never>this.tracked[p];
    });
    if (this.view && this.geometrySelector) {
      this.view?.addStylesheet(this._ssheet);
      resetStylesheet(this, this._ssheet, this.geometrySelector);
    }
  }

  /**
   * Renders geometry to the `hdml-view` shadow `DOM`.
   */
  protected abstract renderGeometry(): void;

  /**
   * Updates geometry in the `hdml-view` shadow `DOM`.
   */
  protected abstract updateGeometry(): void;

  /**
   * The `window` `styles-changed` event listener. Runs the
   * `requestUpdate` method passing the "styles-changed" string as a
   * property key.
   */
  private stylesChangedListener = () => {
    this.requestUpdate();
  };

  /**
   * Returns component static styles.
   */
  private getStaticStyles(): lit.CSSResult {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <lit.CSSResult>this.constructor.styles;
  }
}

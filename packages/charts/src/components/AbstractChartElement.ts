/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit, UnifiedElement } from "@hdml/elements";
import { HdmlViewElement } from "./HdmlViewElement";
import {
  CompletedCSSStyleSheet,
  TrackedStyles,
  updateStyles,
} from "../helpers/updateStyles";

export abstract class AbstractChartElement extends UnifiedElement {
  private _view: null | HdmlViewElement = null;
  private _ssheet = <CompletedCSSStyleSheet>new CSSStyleSheet();
  private _styles = window.getComputedStyle(this);
  private _cache: null | TrackedStyles = null;
  private _stored: TrackedStyles = {
    // size
    width: 0,
    height: 0,

    // position
    top: 0,
    left: 0,

    // padding
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,

    // cursor
    cursor: "auto",

    // font style
    fontFamily: "Times New Roman",
    fontSize: 0,
    fontWeight: 0,
    fontStyle: "normal",
    color: "rgba(0, 0, 0, 0)",

    // line width
    lineWidth: 0,
    lineWidthActive: 0,
    lineWidthFocus: 0,
    lineWidthHover: 0,

    // line color
    lineColor: "rgba(0, 0, 0, 0)",
    lineColorActive: "rgba(0, 0, 0, 0)",
    lineColorFocus: "rgba(0, 0, 0, 0)",
    lineColorHover: "rgba(0, 0, 0, 0)",

    // line style
    lineStyle: "solid",
    lineStyleActive: "solid",
    lineStyleFocus: "solid",
    lineStyleHover: "solid",

    fillColor: "rgba(0, 0, 0, 0)",
    tickStyle: "ellipse",
    tickWidth: 5,
    tickHeight: 5,
    curveType: "linear",
    curveBasisBeta: 0,
    curveBezierTangents: "horizontal",
    curveCardinalTension: 0,
    curveCatmullRomAlpha: 0,
    curveCubicMonotonicity: "x",
    curveStepChange: "middle",
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
    if (!this._cache) {
      // size
      const width = parseFloat(this.styles.width);
      const height = parseFloat(this.styles.height);

      // position
      const top = parseFloat(this.styles.top);
      const left = parseFloat(this.styles.left);

      // padding
      const paddingTop = parseFloat(this.styles.paddingTop);
      const paddingRight = parseFloat(this.styles.paddingRight);
      const paddingBottom = parseFloat(this.styles.paddingBottom);
      const paddingLeft = parseFloat(this.styles.paddingLeft);

      // cursor
      const cursor = this.styles.cursor;

      // line width
      const lineWidth =
        parseFloat(
          this.styles.getPropertyValue("--hdml-line-width"),
        ) || 0;
      const lineWidthActive =
        parseFloat(
          this.styles.getPropertyValue("--hdml-line-width_active"),
        ) || lineWidth;
      const lineWidthFocus =
        parseFloat(
          this.styles.getPropertyValue("--hdml-line-width_focus"),
        ) || lineWidth;
      const lineWidthHover =
        parseFloat(
          this.styles.getPropertyValue("--hdml-line-width_hover"),
        ) || lineWidth;

      // line color
      const lineColor =
        this.styles.getPropertyValue("--hdml-line-color") ||
        "rgba(0, 0, 0, 0)";
      const lineColorActive =
        this.styles.getPropertyValue("--hdml-line-color_active") ||
        "rgba(0, 0, 0, 0)";
      const lineColorFocus =
        this.styles.getPropertyValue("--hdml-line-color_focus") ||
        "rgba(0, 0, 0, 0)";
      const lineColorHover =
        this.styles.getPropertyValue("--hdml-line-color_hover") ||
        "rgba(0, 0, 0, 0)";

      // line style
      const lineStyle =
        this.styles.getPropertyValue("--hdml-line-style") || "solid";
      const lineStyleActive =
        this.styles.getPropertyValue("--hdml-line-style_active") ||
        "solid";
      const lineStyleFocus =
        this.styles.getPropertyValue("--hdml-line-style_focus") ||
        "solid";
      const lineStyleHover =
        this.styles.getPropertyValue("--hdml-line-style_hover") ||
        "solid";

      // font style
      const fontFamily = this.styles.fontFamily;
      const fontSize = parseFloat(this.styles.fontSize);
      const fontWeight = parseFloat(this.styles.fontWeight);
      const fontStyle = this.styles.fontStyle;
      const color = this.styles.color;

      //
      const fillColor =
        this.styles.getPropertyValue("--hdml-fill-color") ||
        "rgba(0, 0, 0, 0)";
      const tickStyle =
        <"text" | "rect" | "ellipse">(
          this.styles.getPropertyValue("--hdml-tick-style")
        ) || "ellipse";
      const tickWidth = parseFloat(
        this.styles.getPropertyValue("--hdml-tick-width") || "0",
      );
      const tickHeight = parseFloat(
        this.styles.getPropertyValue("--hdml-tick-height") || "0",
      );
      const curveType =
        <
          | "natural"
          | "linear"
          | "cubic"
          | "step"
          | "bezier"
          | "basis"
          | "cardinal"
          | "catmull-rom"
        >this.styles.getPropertyValue("--hdml-curve-type") ||
        "linear";
      const beta = parseFloat(
        this.styles.getPropertyValue("--hdml-curve-basis-beta") ||
          "0",
      );
      const curveBasisBeta =
        beta >= 0 && beta <= 1 ? beta : beta < 0 ? 0 : 1;
      const curveBezierTangents =
        <"horizontal" | "vertical">(
          this.styles.getPropertyValue("--hdml-curve-bezier-tangents")
        ) || "horizontal";
      const tension = parseFloat(
        this.styles.getPropertyValue(
          "--hdml-curve-cardinal-tension",
        ) || "0",
      );
      const curveCardinalTension =
        tension >= 0 && tension <= 1 ? tension : tension < 0 ? 0 : 1;

      const alpha = parseFloat(
        this.styles.getPropertyValue(
          "--hdml-curve-catmull-rom-alpha",
        ) || "0",
      );
      const curveCatmullRomAlpha =
        alpha >= 0 && alpha <= 1 ? alpha : alpha < 0 ? 0 : 1;

      const curveCubicMonotonicity =
        <"x" | "y">(
          this.styles.getPropertyValue(
            "--hdml-curve-cubic-monotonicity",
          )
        ) || "x";
      const curveStepChange =
        <"before" | "middle" | "after">(
          this.styles.getPropertyValue("--hdml-curve-step-change")
        ) || "middle";

      this._cache = {
        // size
        width,
        height,

        // position
        top,
        left,

        // padding
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,

        // cursor
        cursor,

        // line width
        lineWidth,
        lineWidthActive,
        lineWidthFocus,
        lineWidthHover,

        // line color
        lineColor,
        lineColorActive,
        lineColorFocus,
        lineColorHover,

        // line style
        lineStyle,
        lineStyleActive,
        lineStyleFocus,
        lineStyleHover,

        // font style
        fontFamily,
        fontSize,
        fontWeight,
        fontStyle,
        color,

        fillColor,
        tickStyle,
        tickWidth,
        tickHeight,
        curveType,
        curveBasisBeta,
        curveBezierTangents,
        curveCardinalTension,
        curveCatmullRomAlpha,
        curveCubicMonotonicity,
        curveStepChange,
      };
    }
    return this._cache;
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
    this._view?.removeStylesheet(this._ssheet);
    this._view = null;
  }

  /**
   * @override
   */
  public shouldUpdate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    changedProperties: Map<PropertyKey, unknown>,
  ): void {
    setTimeout(() => {
      this.renderGeometry();
    });
  }

  /**
   * @override
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected updated(changed: Map<string, unknown>): void {
    setTimeout(() => {
      this.updateStyles();
      this.updateGeometry();
      this.dispatchEvent(
        new CustomEvent("updated", {
          cancelable: false,
          composed: false,
          bubbles: false,
        }),
      );
    });
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
      updateStyles(this, this._ssheet, this.geometrySelector);
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
   * Custom `window.body` `styles-changed` event listener. Runs the
   * `requestUpdate` method.
   */
  private stylesChangedListener = () => {
    this._cache = null;
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

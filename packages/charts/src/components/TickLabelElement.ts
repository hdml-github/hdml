/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { lit } from "@hdml/elements";
import { AxisTickElement } from "./AxisTickElement";
import { HorizontalAxisElement } from "./HorizontalAxisElement";
import { VerticalAxisElement } from "./VerticalAxisElement";
import { AbstractChartElement } from "./AbstractChartElement";

export class TickLabelElement extends AbstractChartElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
    :host {
      display: block;
      position: absolute;
      cursor: pointer;
    }
    :host-context(horizontal-axis) {
      width: 100%;
      height: 1px;
    }
    :host-context(vertical-axis) {
      width: 1px;
      height: 100%;
    }
  `;

  /**
   * Reactive attributes.
   */
  public static properties = {
    /**
     * Private property to force updates.
     */
    _force: {
      type: Boolean,
      attribute: false,
      reflect: false,
      state: false,
    },
  };

  private _stylesheet: CSSStyleSheet = new CSSStyleSheet();
  private _texts: SVGTextElement[] = [];

  /**
   * @implements
   */
  protected get geometrySelector(): null | string {
    if (!this.axis) {
      return null;
    } else {
      return (
        `:host > svg ` +
        `g.${this.axis.direction}-axis ` +
        `g.tick text`
      );
    }
  }

  /**
   * Associated axis element.
   */
  public get axis():
    | null
    | HorizontalAxisElement
    | VerticalAxisElement {
    if (
      this.parentElement &&
      this.parentElement instanceof AxisTickElement
    ) {
      return this.parentElement.axis;
    }
    return null;
  }

  /**
   * Associated tick element.
   */
  public get tick(): null | AxisTickElement {
    if (
      this.parentElement &&
      this.parentElement instanceof AxisTickElement
    ) {
      return this.parentElement;
    }
    return null;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    if (this.tick) {
      this.tick.addEventListener("updated", this.tickUpdatedListener);
    }
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    if (this.tick) {
      this.tick.removeEventListener(
        "updated",
        this.tickUpdatedListener,
      );
    }
    this.detachListeners();
    this._texts = [];
    super.disconnectedCallback();
  }

  /**
   * @override
   */
  protected updateStyles(): void {
    if (this.tick) {
      this._stylesheet.insertRule(`
        :host-context(horizontal-axis[position=top]) {
          bottom: ${this.tick.tracked.height}px;
        }
      `);
      this._stylesheet.insertRule(`
        :host-context(horizontal-axis[position=center]),
        :host-context(horizontal-axis[position=bottom]) {
          top: ${this.tick.tracked.height}px;
        }
      `);
      this._stylesheet.insertRule(`
        :host-context(vertical-axis[position=left]),
        :host-context(vertical-axis[position=center]) {
            right: ${this.tick.tracked.width}px;
          }
      `);
      this._stylesheet.insertRule(`
        :host-context(vertical-axis[position=right]) {
            left: ${this.tick.tracked.width}px;
          }
      `);
    }
    super.updateStyles();
  }

  /**
   * @implements
   */
  protected renderGeometry(): void {
    this.resetStylesheets([this._stylesheet]);
  }

  /**
   * @implements
   */
  protected updateGeometry(): void {
    if (
      this.isConnected &&
      this.tick &&
      this.axis &&
      this.axis.selection &&
      this._texts.length === 0
    ) {
      this._texts = this.axis.selection
        .selectChildren("g.tick")
        .nodes()
        .map((el) => {
          const line = <SVGTextElement>(
            (<SVGGElement>el).querySelector("text")
          );
          line.setAttribute("tabindex", "-1");
          return line;
        });
      this.attachListeners();
    }
  }

  /**
   * Associated axis `styles-changed` event listener.
   */
  private tickUpdatedListener = () => {
    this.requestUpdate("_force", true);
  };

  /**
   * Attaches event listeners to the associated `svg` elements.
   */
  private attachListeners(): void {
    if (this._texts.length > 0) {
      this._texts.forEach((element) => {
        element.addEventListener("mouseenter", this.eventListener);
        element.addEventListener("mouseleave", this.eventListener);
        element.addEventListener("mousemove", this.eventListener);
        element.addEventListener("mouseover", this.eventListener);
        element.addEventListener("mouseout", this.eventListener);
        element.addEventListener("mousedown", this.eventListener);
        element.addEventListener("mouseup", this.eventListener);
        element.addEventListener("click", this.eventListener);
        element.addEventListener("focus", this.eventListener);
        element.addEventListener("blur", this.eventListener);
      });
    }
  }

  /**
   * Detaches event listeners to the associated `svg` elements.
   */
  private detachListeners(): void {
    if (this._texts.length > 0) {
      this._texts.forEach((element) => {
        element.removeEventListener("mouseenter", this.eventListener);
        element.removeEventListener("mouseleave", this.eventListener);
        element.removeEventListener("mousemove", this.eventListener);
        element.removeEventListener("mouseover", this.eventListener);
        element.removeEventListener("mouseout", this.eventListener);
        element.removeEventListener("mousedown", this.eventListener);
        element.removeEventListener("mouseup", this.eventListener);
        element.removeEventListener("click", this.eventListener);
        element.removeEventListener("focus", this.eventListener);
        element.removeEventListener("blur", this.eventListener);
      });
    }
  }

  /**
   * `svg` element event listener.
   */
  private eventListener = (evt: Event) => {
    switch (evt.type) {
      case "mouseenter":
        this.dispatchEvent(new MouseEvent(evt.type));
        break;
      case "mouseleave":
        this.dispatchEvent(new MouseEvent(evt.type));
        break;
      case "mousemove":
        this.dispatchEvent(new MouseEvent(evt.type));
        break;
      case "mouseover":
        this.dispatchEvent(new MouseEvent(evt.type));
        break;
      case "mouseout":
        this.dispatchEvent(new MouseEvent(evt.type));
        break;
      case "mousedown":
        this.dispatchEvent(new MouseEvent(evt.type));
        break;
      case "mouseup":
        this.dispatchEvent(new MouseEvent(evt.type));
        break;
      case "click":
        this.dispatchEvent(new PointerEvent(evt.type));
        break;
      case "focus":
        this.dispatchEvent(new FocusEvent(evt.type));
        break;
      case "blur":
        this.dispatchEvent(new FocusEvent(evt.type));
        break;
    }
  };
}

customElements.define("tick-label", TickLabelElement);

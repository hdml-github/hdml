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
      box-sizing: border-box;
    }
    :host-context(horizontal-axis[position=top]) {
      bottom: 5px;
    }
    :host-context(horizontal-axis[position=center]),
    :host-context(horizontal-axis[position=bottom]) {
      top: 5px;
    }
    :host-context(vertical-axis[position=left]),
    :host-context(vertical-axis[position=center]) {
      right: 5px;
    }
    :host-context(vertical-axis[position=right]) {
      left: 5px;
    }
  `;

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
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  /**
   * @override
   */
  public render(): lit.TemplateResult<1> {
    return lit.html`<slot></slot>`;
  }

  /**
   * @override
   */
  protected firstUpdated(
    changedProperties: Map<PropertyKey, unknown>,
  ): void {
    super.firstUpdated(changedProperties);
    this.updateSvgStyles();
  }

  /**
   * @override
   */
  protected updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    this.updateSvgStyles();
  }

  /**
   * @override
   */
  protected trackedStylesChanged(): void {
    this.updateSvgStyles();
  }

  /**
   * @override
   */
  protected updateSvgStyles(): void {
    if (this.axis) {
      super.updateSvgStyles(
        `:host > svg ` +
          `g.${this.axis.direction}-axis ` +
          `g.tick text`,
      );
    }
  }
}

customElements.define("tick-label", TickLabelElement);

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
      cursor: pointer;
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
   * @override
   */
  public render(): lit.TemplateResult<1> {
    return lit.html`
      <slot></slot>
    `;
  }

  /**
   * @implements
   */
  protected renderGeometry(): void {
    //
  }

  /**
   * @implements
   */
  protected updateGeometry(): void {
    //
  }
}

customElements.define("tick-label", TickLabelElement);

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { type Selection } from "d3";
import { LinearScaleElement } from "./LinearScaleElement";
import { OrdinalScaleElement } from "./OrdinalScaleElement";
import {
  AbstractDirectionElement,
  DirectionType,
} from "./AbstractDirectionElement";

/**
 * Selected `path` element.
 */
type SelectedPath = Selection<
  SVGPathElement,
  unknown,
  null,
  undefined
>;

/**
 * Axis event.
 */
type AxisEvent = (MouseEvent | PointerEvent | FocusEvent) & {
  datum?: number | string;
};

/**
 * The abstract class, which encapsules the logic that is required to
 * visualize axis.
 */
// eslint-disable-next-line max-len
export abstract class AbstractAxisElement extends AbstractDirectionElement {
  private _selectedPath: null | SelectedPath = null;
  private _events: Set<string> = new Set();

  /**
   * @implements
   */
  protected get geometrySelector(): null | string {
    return (
      `:host > svg g.${this.dimension}-dimension#_${this.uid} ` +
      `path.axis`
    );
  }

  /**
   * `D3` selection of the `<path>` element.
   */
  public get selectedPath(): null | SelectedPath {
    return this._selectedPath;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    if (this.selectedPath) {
      this.renderGeometry();
    }
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    this.selectedPath?.remove();
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
   * @implements
   */
  protected renderGeometry(): void {
    super.renderGeometry();
    if (this.view?.svg && this.selectedGroup && !this.selectedPath) {
      this._selectedPath = this.selectedGroup
        .append("path")
        .attr("class", "axis")
        .attr("tabindex", "-1")
        .attr("d", this.getPathD());
    } else if (
      this.view?.svg &&
      this.selectedGroup &&
      this.selectedPath
    ) {
      this.selectedGroup.insert(() => {
        if (this.selectedPath) {
          return this.selectedPath.node();
        } else {
          return null;
        }
      });
    }
  }

  /**
   * @implements
   */
  protected updateGeometry(): void {
    super.updateGeometry();
    if (this.selectedPath) {
      this.selectedPath.attr("d", this.getPathD());
    }
  }

  /**
   * Returns axis path `d` property value.
   */
  private getPathD(): string {
    if (this.isConnected && this.scale && this.scale.scale) {
      const offset =
        typeof window !== "undefined" && window.devicePixelRatio > 1
          ? 0
          : 0; // 0.5; TODO: why it was here?
      const range = this.scale.scale.range();
      const range0 = +range[0] + offset;
      const range1 = +range[range.length - 1] + offset;
      const d =
        this.type === DirectionType.Vertical
          ? `M${offset},${range0}V${range1}`
          : `M${range0},${offset}H${range1}`;
      return d;
    }
    return "M0,0";
  }

  /**
   * @override
   */
  public addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (
      this: HTMLElement,
      ev: HTMLElementEventMap[K],
    ) => unknown,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void;
  public addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void {
    if (!this._events.has(type)) {
      this._events.add(type);
      this.selectedPath?.on(type, this.proxyEvent.bind(this));
    }
    super.addEventListener(type, listener, options);
  }

  /**
   * @override
   */
  public removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (
      this: HTMLElement,
      ev: HTMLElementEventMap[K],
    ) => unknown,
    options?: boolean | EventListenerOptions | undefined,
  ): void;
  public removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions | undefined,
  ): void {
    if (this._events.has(type)) {
      this._events.delete(type);
      this.selectedPath?.on(type, null);
    }
    super.removeEventListener(type, listener, options);
  }

  /**
   * Proxy the `event` of the `svg` element to the `hdml` element.
   */
  private proxyEvent = (event: Event) => {
    let evt: AxisEvent;
    let datum: undefined | number;
    if (event instanceof MouseEvent) {
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const elemLeft = this.view?.getClientRects()[0].left || 0;
      const elemTop = this.view?.getClientRects()[0].top || 0;
      const x = mouseX - elemLeft;
      const y = mouseY - elemTop;
      if (this.scale instanceof LinearScaleElement) {
        if (this.type === DirectionType.Horizontal) {
          datum = this.scale.scale?.invert(x);
        } else {
          datum = this.scale.scale?.invert(y);
        }
      }
    }
    switch (event.type) {
      case "mouseenter":
      case "mouseleave":
      case "mousemove":
      case "mouseover":
      case "mouseout":
      case "mousedown":
      case "mouseup":
        evt = new MouseEvent(event.type);
        evt.datum = datum;
        this.dispatchEvent(evt);
        break;
      case "click":
        evt = new PointerEvent(event.type);
        evt.datum = datum;
        this.dispatchEvent(evt);
        break;
      case "focus":
      case "blur":
        evt = new FocusEvent(event.type);
        this.dispatchEvent(evt);
        break;
    }
  };
}

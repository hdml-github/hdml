/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { UnifiedElement } from "@hdml/elements";
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
};

export class BaseChartElement extends UnifiedElement {
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
    };
  }

  /**
   * Stored component styles.
   */
  public stored(): TrackedStyles {
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
    super.disconnectedCallback();
  }

  /**
   * Callback to the interval for checking the monitored styles.
   */
  private stylesChangedListener = () => {
    const props = <(keyof TrackedStyles)[]>Object.keys(this._stored);
    const changed = props.filter((prop) => {
      const p = prop;
      return this._stored[p] !== this.tracked[p];
    });
    if (changed.length) {
      this.trackedStylesChanged(changed);
      changed.forEach((p) => {
        this._stored[p] = this.tracked[p];
      });
    }
  };

  /**
   * Callback to the styles changed event.
   */
  public trackedStylesChanged(styles: string[]): void {
    //
  }
}

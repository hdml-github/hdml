/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { JoinDef, JoinType, FilterOperator } from "@hdml/schema";
import {
  TABLE_NAME_REGEXP,
  JOIN_TYPE_REGEXP,
} from "../helpers/constants";
import {
  getModelTag,
  getConnectiveTag,
} from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";
import { ConnectiveElement, ConnDetail } from "./ConnectiveElement";

/**
 * `hdml-join:connected`, `hdml-join:changed`, `hdml-join:request`,
 * `hdml-join:disconnected` events details interface.
 */
export interface JoinDetail {
  join: JoinElement;
}

/**
 * `JoinElement` class. Adds a new `HTML` tag (default `hdml-join`)
 * which is the root element to describe the join of two tables in the
 * underlying data model.
 */
export class JoinElement extends UnifiedElement {
  /**
   * Reactive attributes.
   */
  public static properties = {
    /**
     * The `type` property definition.
     */
    type: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * The `left` property definition.
     */
    left: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * The `right` property definition.
     */
    right: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },
  };

  /**
   * The `type` private property.
   */
  private _type: null | string = null;

  /**
   * The `left` private property.
   */
  private _left: null | string = null;

  /**
   * The `right` private property.
   */
  private _right: null | string = null;

  /**
   * The assosiated `ModelElement` element.
   */
  private _model: null | Element = null;

  /**
   * The assosiated `ConnectiveElement` element.
   */
  private _connective: null | ConnectiveElement = null;

  /**
   * The `type` setter.
   */
  public set type(val: null | string) {
    if (val === null || val === "" || JOIN_TYPE_REGEXP.test(val)) {
      const old = this._type;
      this._type = val;
      this.requestUpdate("type", old);
    } else {
      console.error(
        `The \`type\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("type") === val) {
        if (this._type === null) {
          this.removeAttribute("type");
        } else {
          this.setAttribute("type", this._type);
        }
      }
    }
  }

  /**
   * The `type` getter.
   */
  public get type(): null | string {
    return this._type;
  }

  /**
   * The `left` setter.
   */
  public set left(val: null | string) {
    if (val === null || val === "" || TABLE_NAME_REGEXP.test(val)) {
      const old = this._left;
      this._left = val;
      this.requestUpdate("left", old);
    } else {
      console.error(
        `The \`left\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("left") === val) {
        if (this._left === null) {
          this.removeAttribute("left");
        } else {
          this.setAttribute("left", this._left);
        }
      }
    }
  }

  /**
   * The `left` getter.
   */
  public get left(): null | string {
    return this._left;
  }

  /**
   * The `right` setter.
   */
  public set right(val: null | string) {
    if (val === null || val === "" || TABLE_NAME_REGEXP.test(val)) {
      const old = this._right;
      this._right = val;
      this.requestUpdate("right", old);
    } else {
      console.error(
        `The \`right\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("right") === val) {
        if (this._right === null) {
          this.removeAttribute("right");
        } else {
          this.setAttribute("right", this._right);
        }
      }
    }
  }

  /**
   * The `right` getter.
   */
  public get right(): null | string {
    return this._right;
  }

  /**
   * The `JoinDef` object.
   */
  public get data(): JoinDef {
    if (!this.type) {
      throw new Error("The `type` property is required.");
    }
    if (!this.left) {
      throw new Error("The `left` property is required.");
    }
    if (!this.right) {
      throw new Error("The `right` property is required.");
    }
    const clause = this._connective
      ? this._connective.data
      : {
          type: FilterOperator.None,
          filters: [],
          children: [],
        };
    return {
      type: this._getJoinType(this.type),
      left: this.left,
      right: this.right,
      clause,
    };
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    this._model = this._getModel();
    if (this._model) {
      this._model.dispatchEvent(
        new CustomEvent<JoinDetail>("hdml-join:connected", {
          cancelable: false,
          composed: false,
          bubbles: false,
          detail: {
            join: this,
          },
        }),
      );
    }
    this._watchConnective();
  }

  /**
   * @override
   */
  public attributeChangedCallback(
    name: string,
    old: string,
    value: string,
  ): void {
    super.attributeChangedCallback(name, old, value);
    this._dispatchChangedEvent();
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    this._unwatchConnective();
    if (this._model) {
      this._model.dispatchEvent(
        new CustomEvent<JoinDetail>("hdml-join:disconnected", {
          cancelable: false,
          composed: false,
          bubbles: false,
          detail: {
            join: this,
          },
        }),
      );
      this._model = null;
    }
    super.disconnectedCallback();
  }

  /**
   * Component renderer.
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }

  /**
   * Returns the associated `ModelElement` element if it exists, or
   * `null` otherwise.
   */
  private _getModel(): null | Element {
    let element = this.parentElement;
    while (
      element &&
      element.tagName !== "BODY" &&
      element.tagName !== getModelTag().toUpperCase()
    ) {
      element = element.parentElement;
    }
    return element && element.tagName !== "BODY" ? element : null;
  }

  /**
   * Starts tracking changes to `ConnectiveElement` elements.
   */
  private _watchConnective(): void {
    const conn = <ConnectiveElement>(
      this.querySelector(getConnectiveTag())
    );
    if (conn) {
      this._attachConnective(conn);
    }
    this.addEventListener(
      "hdml-connective:connected",
      this._connectiveConnectedListener,
    );
    this.addEventListener(
      "hdml-connective:disconnected",
      this._connectiveDisconnectedListener,
    );
  }

  /**
   * Stops watching for changes to `ConnectiveElement` elements.
   */
  private _unwatchConnective(): void {
    this.removeEventListener(
      "hdml-connective:connected",
      this._connectiveConnectedListener,
    );
    this.removeEventListener(
      "hdml-connective:disconnected",
      this._connectiveDisconnectedListener,
    );
    this._detachConnective();
  }

  /**
   * `hdml-connective:connected` event listener.
   */
  private _connectiveConnectedListener = (
    event: CustomEvent<ConnDetail>,
  ) => {
    const conn = event.detail.conn;
    this._attachConnective(conn);
  };

  /**
   * `hdml-connective:disconnected` event listener.
   */
  private _connectiveDisconnectedListener = () => {
    this._detachConnective();
  };

  /**
   * `hdml-connective:changed` event listener.
   */
  private _connectiveChangedListener = () => {
    this._dispatchChangedEvent();
  };

  /**
   * Attaches a `ConnectiveElement` element.
   */
  private _attachConnective(conn: ConnectiveElement) {
    if (!this._connective) {
      this._connective = conn;
      this._connective.addEventListener(
        "hdml-connective:changed",
        this._connectiveChangedListener,
      );
      this._dispatchChangedEvent();
    }
  }

  /**
   * Detaches a `ConnectiveElement` element.
   */
  private _detachConnective() {
    if (this._connective) {
      this._connective.removeEventListener(
        "hdml-connective:changed",
        this._connectiveChangedListener,
      );
      this._connective = null;
      this._dispatchChangedEvent();
    }
  }

  /**
   * Dispatches the `hdml-join:changed` event.
   */
  private _dispatchChangedEvent(): void {
    this.dispatchEvent(
      new CustomEvent<JoinDetail>("hdml-join:changed", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          join: this,
        },
      }),
    );
  }

  /**
   * Converts a `type` property to a `JoinType` enum.
   */
  private _getJoinType(type: string): JoinType {
    switch (type) {
      case "cross":
        return JoinType.Cross;
      case "inner":
        return JoinType.Inner;
      case "full":
        return JoinType.Full;
      case "left":
        return JoinType.Left;
      case "right":
        return JoinType.Right;
      case "full-outer":
        return JoinType.FullOuter;
      case "left-outer":
        return JoinType.LeftOuter;
      case "right-outer":
        return JoinType.RightOuter;
      default:
        throw new Error(`Unsupported join type "${type}".`);
    }
  }
}

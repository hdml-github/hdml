/**
 * @fileoverview The `JoinElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { JoinData, JoinType, FilterOperator } from "@hdml/schema";

import {
  TABLE_NAME_REGEXP,
  JOIN_TYPE_REGEXP,
} from "../helpers/constants";
import {
  getModelTag,
  getConnectiveTag,
} from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";
import {
  ConnectiveElement,
  ConnEventDetail,
} from "./ConnectiveElement";

/**
 * An `hdml-join` element event detail interface.
 */
export interface JoinEventDetail {
  join: JoinElement;
}

/**
 * The `JoinElement` class.
 */
export class JoinElement extends UnifiedElement {
  /**
   * Reactive attributes.
   */
  public static properties = {
    /**
     * A `type` property definition.
     */
    type: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `left` property definition.
     */
    left: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `right` property definition.
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
   * A `type` private property.
   */
  private _type: null | string = null;

  /**
   * A `left` private property.
   */
  private _left: null | string = null;

  /**
   * A `right` private property.
   */
  private _right: null | string = null;

  /**
   * An assosiated `hdml-model` element.
   */
  private _model: null | Element = null;

  /**
   * An assosiated `hdml-connective` element.
   */
  private _connective: null | ConnectiveElement = null;

  /**
   * A `type` setter.
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
   * A `type` getter.
   */
  public get type(): null | string {
    return this._type;
  }

  /**
   * A `left` setter.
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
   * A `left` getter.
   */
  public get left(): null | string {
    return this._left;
  }

  /**
   * A `right` setter.
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
   * A `right` getter.
   */
  public get right(): null | string {
    return this._right;
  }

  /**
   * The `JoinData` object.
   */
  public get data(): JoinData {
    if (!this.type) {
      throw new Error("A `type` property is required.");
    }
    if (!this.left) {
      throw new Error("A `left` property is required.");
    }
    if (!this.right) {
      throw new Error("A `right` property is required.");
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
        new CustomEvent<JoinEventDetail>("hdml-join:connected", {
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
        new CustomEvent<JoinEventDetail>("hdml-join:disconnected", {
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
   * Component template.
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }

  /**
   * Returns assosiated `hdml-model` element if exist or null
   * otherwise.
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
   * Starts watching for the `hdml-connective` elements changes.
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
   * Stops watching for the `hdml-connective` elements changes.
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
   * The `hdml-connective:connected` event listener.
   */
  private _connectiveConnectedListener = (
    event: CustomEvent<ConnEventDetail>,
  ) => {
    const conn = event.detail.conn;
    this._attachConnective(conn);
  };

  /**
   * The `hdml-connective:disconnected` event listener.
   */
  private _connectiveDisconnectedListener = (
    event: CustomEvent<ConnEventDetail>,
  ) => {
    this._detachConnective();
  };

  /**
   * The `hdml-connective:changed` event listener.
   */
  private _connectiveChangedListener = (
    event: CustomEvent<ConnEventDetail>,
  ) => {
    this._dispatchChangedEvent();
  };

  /**
   * Attaches `hdml-connective` element.
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
   * Detaches `hdml-connective` element.
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
      new CustomEvent<JoinEventDetail>("hdml-join:changed", {
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
   * Converts `type` property to a `JoinType` enum.
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

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { FieldDef, FrameDef } from "@hdml/schema";
import {
  FRAME_NAME_REGEXP,
  FRAME_SOURCE_REGEXP,
  FRAME_OFFSET_REGEXP,
  FRAME_LIMIT_REGEXP,
} from "../helpers/constants";
import {
  getFieldTag,
  getFilterByTag,
  getGroupByTag,
  getSortByTag,
} from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";
import { FieldElement, FieldDetail } from "./FieldElement";
import { FilterByElement, FilterByDetail } from "./FilterByElement";
import { GroupByElement, GroupByDetail } from "./GroupByElement";
import { SortByElement, SortByDetail } from "./SortByElement";

/**
 * `hdml-frame:connected`, `hdml-frame:changed`, `hdml-frame:request`,
 * `hdml-frame:disconnected` events details interface.
 */
export interface FrameDetail {
  frame: FrameElement;
}

/**
 * `FrameElement` class. Adds an `HTML` tag (`hdml-frame` by default),
 * which is the root tag for describing the request data frame. The
 * data frame is a set of fields, filters, sorting and grouping.
 */
export class FrameElement extends UnifiedElement {
  /**
   * Reactive attributes.
   */
  public static properties = {
    /**
     * The `name` property definition.
     */
    name: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * The `source` property definition.
     */
    source: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * The `offset` property definition.
     */
    offset: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * The `limit` property definition.
     */
    limit: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },
  };

  /**
   * The `name` private property.
   */
  private _name: null | string = null;

  /**
   * The `source` private property.
   */
  private _source: null | string = null;

  /**
   * The `offset` private property.
   */
  private _offset: null | string = null;

  /**
   * The `source` private property.
   */
  private _limit: null | string = null;

  /**
   * A map of attached `FieldElement` elements.
   */
  private _fields: Map<string, FieldElement> = new Map();

  /**
   * The attached `FilterByElement` element.
   */
  private _filterBy: null | FilterByElement = null;

  /**
   * The attached `GroupByElement` element.
   */
  private _groupBy: null | GroupByElement = null;

  /**
   * The attached `SortByElement` element.
   */
  private _sortBy: null | SortByElement = null;

  /**
   * The `name` setter.
   */
  public set name(val: null | string) {
    if (val === null || val === "" || FRAME_NAME_REGEXP.test(val)) {
      const old = this._name;
      this._name = val;
      this.requestUpdate("name", old);
    } else {
      console.error(
        `The \`name\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("name") === val) {
        if (this._name === null) {
          this.removeAttribute("name");
        } else {
          this.setAttribute("name", this._name);
        }
      }
    }
  }

  /**
   * The `name` getter.
   */
  public get name(): null | string {
    return this._name;
  }

  /**
   * The `source` setter.
   */
  public set source(val: null | string) {
    if (
      val === null ||
      val === "" ||
      (FRAME_SOURCE_REGEXP.test(val) &&
        (val.includes("?hdml-model=") ||
          val.includes("?hdml-frame=")) &&
        (val.startsWith("?hdml-model=") ||
          val.startsWith("?hdml-frame=") ||
          val.startsWith("/")))
    ) {
      const old = this._source;
      this._source = val;
      this.requestUpdate("source", old);
    } else {
      console.error(
        `The \`source\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("source") === val) {
        if (this._source === null) {
          this.removeAttribute("source");
        } else {
          this.setAttribute("source", this._source);
        }
      }
    }
  }

  /**
   * The `source` getter.
   */
  public get source(): null | string {
    return this._source ? this._source.replaceAll("`", '"') : null;
  }

  /**
   * The `offset` setter.
   */
  public set offset(val: null | string) {
    if (val === null || val === "" || FRAME_OFFSET_REGEXP.test(val)) {
      const old = this._offset;
      this._offset = val;
      this.requestUpdate("offset", old);
    } else {
      console.error(
        `The \`offset\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("offset") === val) {
        if (this._offset === null) {
          this.removeAttribute("offset");
        } else {
          this.setAttribute("offset", this._offset);
        }
      }
    }
  }

  /**
   * The `offset` getter.
   */
  public get offset(): null | string {
    return this._offset;
  }

  /**
   * The `limit` setter.
   */
  public set limit(val: null | string) {
    if (val === null || val === "" || FRAME_LIMIT_REGEXP.test(val)) {
      const old = this._limit;
      this._limit = val;
      this.requestUpdate("limit", old);
    } else {
      console.error(
        `The \`limit\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("limit") === val) {
        if (this._limit === null) {
          this.removeAttribute("limit");
        } else {
          this.setAttribute("limit", this._limit);
        }
      }
    }
  }

  /**
   * The `limit` getter.
   */
  public get limit(): null | string {
    return this._limit;
  }

  /**
   * The `FrameDef` object.
   */
  public get data(): FrameDef {
    if (!this.name) {
      throw new Error("A `name` property is required.");
    }
    if (!this.source) {
      throw new Error("A `source` property is required.");
    }
    const fields: FieldDef[] = [];
    this._fields.forEach((field) => {
      fields.push(field.data);
    });
    return {
      name: this.name,
      source: this.source,
      offset: parseInt(this.offset || "0", 10),
      limit: parseInt(this.limit || "50000", 10),
      fields,
      filterBy: this._filterBy ? this._filterBy.data : undefined,
      groupBy: this._groupBy ? this._groupBy.data : undefined,
      splitBy: undefined,
      sortBy: this._sortBy ? this._sortBy.data : undefined,
      parent: undefined,
    };
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    document.body.dispatchEvent(
      new CustomEvent<FrameDetail>("hdml-frame:connected", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          frame: this,
        },
      }),
    );
    this._watchFields();
    this._watchFilterBy();
    this._watchGroupBy();
    this._watchSortBy();
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
    this._unwatchFields();
    this._unwatchFilterBy();
    this._unwatchGroupBy();
    this._unwatchSortBy();
    document.body.dispatchEvent(
      new CustomEvent<FrameDetail>("hdml-frame:disconnected", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          frame: this,
        },
      }),
    );
    super.disconnectedCallback();
  }

  /**
   * Component renderer.
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }

  /**
   * Initializes a request by raising the `hdml-frame:request` event.
   */
  public query(): void {
    this.dispatchEvent(
      new CustomEvent<FrameDetail>("hdml-frame:request", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          frame: this,
        },
      }),
    );
  }

  /**
   * Starts tracking changes to `FieldElement` elements.
   */
  private _watchFields(): void {
    this.queryHdmlChildren<FieldElement>(getFieldTag()).forEach(
      (field) => {
        this._attachField(field);
      },
    );
    this.addEventListener(
      "hdml-field:connected",
      this._fieldConnectedListener,
    );
    this.addEventListener(
      "hdml-field:disconnected",
      this._fieldDisconnectedListener,
    );
  }

  /**
   * Starts tracking changes to `FilterByElement` element.
   */
  private _watchFilterBy(): void {
    const filterBy = this.querySelector(getFilterByTag());
    if (filterBy) {
      this._attachFilterBy(<FilterByElement>filterBy);
    }
    this.addEventListener(
      "hdml-filter-by:connected",
      this._filterByConnectedListener,
    );
    this.addEventListener(
      "hdml-filter-by:disconnected",
      this._filterByDisconnectedListener,
    );
  }

  /**
   * Starts tracking changes to `GroupByElement` element.
   */
  private _watchGroupBy(): void {
    const groupBy = this.querySelector(getGroupByTag());
    if (groupBy) {
      this._attachGroupBy(<GroupByElement>groupBy);
    }
    this.addEventListener(
      "hdml-group-by:connected",
      this._groupByConnectedListener,
    );
    this.addEventListener(
      "hdml-group-by:disconnected",
      this._groupByDisconnectedListener,
    );
  }

  /**
   * Starts tracking changes to `SortByElement` element.
   */
  private _watchSortBy(): void {
    const sortBy = this.querySelector(getSortByTag());
    if (sortBy) {
      this._attachSortBy(<SortByElement>sortBy);
    }
    this.addEventListener(
      "hdml-sort-by:connected",
      this._sortByConnectedListener,
    );
    this.addEventListener(
      "hdml-sort-by:disconnected",
      this._sortByDisconnectedListener,
    );
  }

  /**
   * Stops watching for changes to `FieldElement` elements.
   */
  private _unwatchFields(): void {
    this.removeEventListener(
      "hdml-field:connected",
      this._fieldConnectedListener,
    );
    this.removeEventListener(
      "hdml-field:disconnected",
      this._fieldDisconnectedListener,
    );
    this._fields.forEach((field) => {
      this._detachField(field);
    });
    this._fields.clear();
  }

  /**
   * Stops watching for changes to `FilterByElement` element.
   */
  private _unwatchFilterBy(): void {
    this.removeEventListener(
      "hdml-filter-by:connected",
      this._filterByConnectedListener,
    );
    this.removeEventListener(
      "hdml-filter-by:disconnected",
      this._filterByDisconnectedListener,
    );
    if (this._filterBy) {
      this._detachFilterBy(this._filterBy);
    }
  }

  /**
   * Stops watching for changes to `GroupByElement` element.
   */
  private _unwatchGroupBy(): void {
    this.removeEventListener(
      "hdml-group-by:connected",
      this._groupByConnectedListener,
    );
    this.removeEventListener(
      "hdml-group-by:disconnected",
      this._groupByDisconnectedListener,
    );
    if (this._groupBy) {
      this._detachGroupBy(this._groupBy);
    }
  }

  /**
   * Stops watching for changes to `SortByElement` element.
   */
  private _unwatchSortBy(): void {
    this.removeEventListener(
      "hdml-sort-by:connected",
      this._sortByConnectedListener,
    );
    this.removeEventListener(
      "hdml-sort-by:disconnected",
      this._sortByDisconnectedListener,
    );
    if (this._sortBy) {
      this._detachSortBy(this._sortBy);
    }
  }

  /**
   * `hdml-field:connected` event listener.
   */
  private _fieldConnectedListener = (
    event: CustomEvent<FieldDetail>,
  ) => {
    const field = event.detail.field;
    this._attachField(field);
  };

  /**
   * `hdml-filter-by:connected` event listener.
   */
  private _filterByConnectedListener = (
    event: CustomEvent<FilterByDetail>,
  ) => {
    this._attachFilterBy(event.detail.filterBy);
  };

  /**
   * `hdml-group-by:connected` event listener.
   */
  private _groupByConnectedListener = (
    event: CustomEvent<GroupByDetail>,
  ) => {
    this._attachGroupBy(event.detail.groupBy);
  };

  /**
   * `hdml-sort-by:connected` event listener.
   */
  private _sortByConnectedListener = (
    event: CustomEvent<SortByDetail>,
  ) => {
    this._attachSortBy(event.detail.sortBy);
  };

  /**
   * `hdml-field:disconnected` event listener.
   */
  private _fieldDisconnectedListener = (
    event: CustomEvent<FieldDetail>,
  ) => {
    const field = event.detail.field;
    this._detachField(field);
  };

  /**
   * `hdml-filter-by:disconnected` event listener.
   */
  private _filterByDisconnectedListener = (
    event: CustomEvent<FilterByDetail>,
  ) => {
    this._detachFilterBy(event.detail.filterBy);
  };

  /**
   * `hdml-group-by:disconnected` event listener.
   */
  private _groupByDisconnectedListener = (
    event: CustomEvent<GroupByDetail>,
  ) => {
    this._detachGroupBy(event.detail.groupBy);
  };

  /**
   * `hdml-sort-by:disconnected` event listener.
   */
  private _sortByDisconnectedListener = (
    event: CustomEvent<SortByDetail>,
  ) => {
    this._detachSortBy(event.detail.sortBy);
  };

  /**
   * `hdml-field:changed` event listener.
   */
  private _fieldChangedListener = () => {
    this._dispatchChangedEvent();
  };

  /**
   * `hdml-filter-by:changed` event listener.
   */
  private _filterByChangedListener = () => {
    this._dispatchChangedEvent();
  };

  /**
   * `hdml-group-by:changed` event listener.
   */
  private _groupByChangedListener = () => {
    this._dispatchChangedEvent();
  };

  /**
   * `hdml-sort-by:changed` event listener.
   */
  private _sortByChangedListener = () => {
    this._dispatchChangedEvent();
  };

  /**
   * Attaches a `FieldElement` element to the fields map.
   */
  private _attachField(field: FieldElement) {
    if (field.uid && !this._fields.has(field.uid)) {
      this._fields.set(field.uid, field);
      field.addEventListener(
        "hdml-field:changed",
        this._fieldChangedListener,
      );
      this._dispatchChangedEvent();
    }
  }

  /**
   * Attaches a `FilterByElement` element.
   */
  private _attachFilterBy(filterBy: FilterByElement) {
    if (!this._filterBy) {
      this._filterBy = filterBy;
      this._filterBy.addEventListener(
        "hdml-filter-by:changed",
        this._filterByChangedListener,
      );
      this._dispatchChangedEvent();
    }
  }

  /**
   * Attaches a `GroupByElement` element.
   */
  private _attachGroupBy(groupBy: GroupByElement) {
    if (!this._groupBy) {
      this._groupBy = groupBy;
      this._groupBy.addEventListener(
        "hdml-group-by:changed",
        this._groupByChangedListener,
      );
      this._dispatchChangedEvent();
    }
  }

  /**
   * Attaches a `SortByElement` element.
   */
  private _attachSortBy(sortBy: SortByElement) {
    if (!this._sortBy) {
      this._sortBy = sortBy;
      this._sortBy.addEventListener(
        "hdml-sort-by:changed",
        this._sortByChangedListener,
      );
      this._dispatchChangedEvent();
    }
  }

  /**
   * Detaches `FieldElement` element from the fields map.
   */
  private _detachField(field: FieldElement) {
    if (field.uid && this._fields.has(field.uid)) {
      field.removeEventListener(
        "hdml-field:changed",
        this._fieldChangedListener,
      );
      this._fields.delete(field.uid);
      this._dispatchChangedEvent();
    }
  }

  /**
   * Detaches `FilterByElement` element.
   */
  private _detachFilterBy(filterBy: FilterByElement) {
    if (this._filterBy && this._filterBy.uid === filterBy.uid) {
      this._filterBy.removeEventListener(
        "hdml-filter-by:changed",
        this._filterByChangedListener,
      );
      this._filterBy = null;
      this._dispatchChangedEvent();
    }
  }

  /**
   * Detaches `GroupByElement` element.
   */
  private _detachGroupBy(groupBy: GroupByElement) {
    if (this._groupBy && this._groupBy.uid === groupBy.uid) {
      this._groupBy.removeEventListener(
        "hdml-group-by:changed",
        this._groupByChangedListener,
      );
      this._groupBy = null;
      this._dispatchChangedEvent();
    }
  }

  /**
   * Detaches `SortByElement` element.
   */
  private _detachSortBy(sortBy: SortByElement) {
    if (this._sortBy && this._sortBy.uid === sortBy.uid) {
      this._sortBy.removeEventListener(
        "hdml-sort-by:changed",
        this._sortByChangedListener,
      );
      this._sortBy = null;
      this._dispatchChangedEvent();
    }
  }

  /**
   * Dispatches the `hdml-frame:changed` event.
   */
  private _dispatchChangedEvent(): void {
    this.dispatchEvent(
      new CustomEvent<FrameDetail>("hdml-frame:changed", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          frame: this,
        },
      }),
    );
  }
}

/**
 * @fileoverview The `FrameElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import { FieldData, FrameData } from "@hdml/schema";

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
import { FieldElement, FieldEventDetail } from "./FieldElement";
import {
  FilterByElement,
  FilterByEventDetail,
} from "./FilterByElement";
import { GroupByElement, GroupByEventDetail } from "./GroupByElement";
import { SortByElement, SortByEventDetail } from "./SortByElement";

/**
 * An `hdml-frame` element event detail interface.
 */
export interface FrameEventDetail {
  frame: FrameElement;
}

/**
 * The `FrameElement` class.
 */
export class FrameElement extends UnifiedElement {
  /**
   * Reactive attributes.
   */
  public static properties = {
    /**
     * A `name` property definition.
     */
    name: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `source` property definition.
     */
    source: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `offset` property definition.
     */
    offset: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `limit` property definition.
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
   * A `name` private property.
   */
  private _name: null | string = null;

  /**
   * A `source` private property.
   */
  private _source: null | string = null;

  /**
   * A `offset` private property.
   */
  private _offset: null | string = null;

  /**
   * A `source` private property.
   */
  private _limit: null | string = null;

  /**
   * Attached `hdml-field` elements map.
   */
  private _fields: Map<string, FieldElement> = new Map();

  /**
   * Attached `hdml-filter-by` element map.
   */
  private _filterBy: null | FilterByElement = null;

  /**
   * Attached `hdml-group-by` element map.
   */
  private _groupBy: null | GroupByElement = null;

  /**
   * Attached `hdml-sort-by` element map.
   */
  private _sortBy: null | SortByElement = null;

  /**
   * A `name` setter.
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
   * A `name` getter.
   */
  public get name(): null | string {
    return this._name;
  }

  /**
   * A `source` setter.
   */
  public set source(val: null | string) {
    if (val === null || val === "" || FRAME_SOURCE_REGEXP.test(val)) {
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
   * A `source` getter.
   */
  public get source(): null | string {
    return this._source ? this._source.replaceAll("`", '"') : null;
  }

  /**
   * A `offset` setter.
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
   * A `offset` getter.
   */
  public get offset(): null | string {
    return this._offset;
  }

  /**
   * A `limit` setter.
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
   * A `limit` getter.
   */
  public get limit(): null | string {
    return this._limit;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    document.body.dispatchEvent(
      new CustomEvent<FrameEventDetail>("hdml-frame:connected", {
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
      new CustomEvent<FrameEventDetail>("hdml-frame:disconnected", {
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
   * Component template.
   */
  public render(): TemplateResult<1> {
    return html`<slot></slot>`;
  }

  /**
   * Returns frame `JSON`-representation.
   */
  public toJSON(): FrameData {
    if (!this.name) {
      throw new Error("A `name` property is required.");
    }
    if (!this.source) {
      throw new Error("A `source` property is required.");
    }
    const fields: FieldData[] = [];
    this._fields.forEach((field) => {
      fields.push(field.toJSON());
    });
    return {
      name: this.name,
      host: "",
      source: this.source,
      offset: parseInt(this.offset || "0", 10),
      limit: parseInt(this.limit || "50000", 10),
      fields,
      filterBy: this._filterBy ? this._filterBy.toJSON() : undefined,
      groupBy: this._groupBy ? this._groupBy.toJSON() : undefined,
      splitBy: undefined,
      sortBy: this._sortBy ? this._sortBy.toJSON() : undefined,
      parent: undefined,
    };
  }

  /**
   * Starts watching for the `hdml-field` elements changes.
   */
  private _watchFields(): void {
    this.querySelectorAll(getFieldTag()).forEach((field) => {
      this._attachField(<FieldElement>field);
    });
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
   * Starts watching for the `hdml-filter-by` element changes.
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
   * Starts watching for the `hdml-group-by` element changes.
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
   * Starts watching for the `hdml-sort-by` element changes.
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
   * Stops watching for the `hdml-field` elements changes.
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
   * Stops watching for the `hdml-filter-by` elements changes.
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
   * Stops watching for the `hdml-group-by` elements changes.
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
   * Stops watching for the `hdml-sort-by` elements changes.
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
   * The `hdml-field:connected` event listener.
   */
  private _fieldConnectedListener = (
    event: CustomEvent<FieldEventDetail>,
  ) => {
    const field = event.detail.field;
    this._attachField(field);
  };

  /**
   * The `hdml-filter-by:connected` event listener.
   */
  private _filterByConnectedListener = (
    event: CustomEvent<FilterByEventDetail>,
  ) => {
    this._attachFilterBy(event.detail.filterBy);
  };

  /**
   * The `hdml-group-by:connected` event listener.
   */
  private _groupByConnectedListener = (
    event: CustomEvent<GroupByEventDetail>,
  ) => {
    this._attachGroupBy(event.detail.groupBy);
  };

  /**
   * The `hdml-sort-by:connected` event listener.
   */
  private _sortByConnectedListener = (
    event: CustomEvent<SortByEventDetail>,
  ) => {
    this._attachSortBy(event.detail.sortBy);
  };

  /**
   * The `hdml-field:disconnected` event listener.
   */
  private _fieldDisconnectedListener = (
    event: CustomEvent<FieldEventDetail>,
  ) => {
    const field = event.detail.field;
    this._detachField(field);
  };

  /**
   * The `hdml-filter-by:disconnected` event listener.
   */
  private _filterByDisconnectedListener = (
    event: CustomEvent<FilterByEventDetail>,
  ) => {
    this._detachFilterBy(event.detail.filterBy);
  };

  /**
   * The `hdml-group-by:disconnected` event listener.
   */
  private _groupByDisconnectedListener = (
    event: CustomEvent<GroupByEventDetail>,
  ) => {
    this._detachGroupBy(event.detail.groupBy);
  };

  /**
   * The `hdml-sort-by:disconnected` event listener.
   */
  private _sortByDisconnectedListener = (
    event: CustomEvent<SortByEventDetail>,
  ) => {
    this._detachSortBy(event.detail.sortBy);
  };

  /**
   * The `hdml-field:changed` event listener.
   */
  private _fieldChangedListener = (
    event: CustomEvent<FieldEventDetail>,
  ) => {
    this._dispatchChangedEvent();
  };

  /**
   * The `hdml-filter-by:changed` event listener.
   */
  private _filterByChangedListener = (
    event: CustomEvent<FilterByEventDetail>,
  ) => {
    this._dispatchChangedEvent();
  };

  /**
   * The `hdml-group-by:changed` event listener.
   */
  private _groupByChangedListener = (
    event: CustomEvent<GroupByEventDetail>,
  ) => {
    this._dispatchChangedEvent();
  };

  /**
   * The `hdml-sort-by:changed` event listener.
   */
  private _sortByChangedListener = (
    event: CustomEvent<SortByEventDetail>,
  ) => {
    this._dispatchChangedEvent();
  };

  /**
   * Attaches `hdml-field` element to the fields map.
   */
  private _attachField(field: FieldElement) {
    if (!this._fields.has(field.uid)) {
      this._fields.set(field.uid, field);
      field.addEventListener(
        "hdml-field:changed",
        this._fieldChangedListener,
      );
      this._dispatchChangedEvent();
    }
  }

  /**
   * Attaches `hdml-filter-by` element.
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
   * Attaches `hdml-group-by` element.
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
   * Attaches `hdml-sort-by` element.
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
   * Detaches `hdml-field` element from the fields map.
   */
  private _detachField(field: FieldElement) {
    if (this._fields.has(field.uid)) {
      field.removeEventListener(
        "hdml-field:changed",
        this._fieldChangedListener,
      );
      this._fields.delete(field.uid);
      this._dispatchChangedEvent();
    }
  }

  /**
   * Detaches `hdml-filter-by` element.
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
   * Detaches `hdml-group-by` element.
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
   * Detaches `hdml-sort-by` element.
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
      new CustomEvent<FrameEventDetail>("hdml-frame:changed", {
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

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Builder } from "flatbuffers";
import { Frame } from "../.fbs/query.Frame_generated";
import { FieldHelper, FieldDef } from "./FieldHelper";
import { FilterHelper, FilterClauseDef } from "./FilterHelper";
import { FilterClause } from "../.fbs/query.FilterClause_generated";

/**
 * An object for defining frame.
 */
export type FrameDef = {
  name: string;
  source: string;
  offset: number;
  limit: number;
  fields: FieldDef[];
  filterBy?: FilterClauseDef;
  groupBy?: FieldDef[];
  splitBy?: FieldDef[];
  sortBy?: FieldDef[];
  parent?: FrameDef;
};

/**
 * Frame helper class.
 */
export class FrameHelper {
  private _field: FieldHelper;
  private _filter: FilterHelper;

  public constructor(private _builder: Builder) {
    this._field = new FieldHelper(this._builder);
    this._filter = new FilterHelper(this._builder);
  }

  public bufferizeFrame(data: FrameDef): number {
    const name = this._builder.createString(data.name);
    const source = this._builder.createString(data.source);
    const fields_ = this._field.bufferizeFields(data.fields);
    const fields = Frame.createFieldsVector(this._builder, fields_);
    let clause: undefined | number;
    let group: undefined | number;
    let split: undefined | number;
    let sort: undefined | number;
    let parent: undefined | number;
    if (data.filterBy) {
      clause = this._filter.bufferizeFilterClause(data.filterBy);
    }
    if (data.groupBy) {
      const group_ = this._field.bufferizeFields(data.groupBy);
      group = Frame.createGroupByVector(this._builder, group_);
    }
    if (data.splitBy) {
      const split_ = this._field.bufferizeFields(data.splitBy);
      split = Frame.createSplitByVector(this._builder, split_);
    }
    if (data.sortBy) {
      const sort_ = this._field.bufferizeFields(data.sortBy);
      sort = Frame.createSortByVector(this._builder, sort_);
    }
    if (data.parent) {
      parent = this.bufferizeFrame(data.parent);
    }
    Frame.startFrame(this._builder);
    Frame.addName(this._builder, name);
    Frame.addSource(this._builder, source);
    Frame.addLimit(this._builder, BigInt(data.limit));
    Frame.addOffset(this._builder, BigInt(data.offset));
    Frame.addFields(this._builder, fields);
    if (clause) {
      Frame.addFilterBy(this._builder, clause);
    }
    if (group) {
      Frame.addGroupBy(this._builder, group);
    }
    if (split) {
      Frame.addSplitBy(this._builder, split);
    }
    if (sort) {
      Frame.addSortBy(this._builder, sort);
    }
    if (parent) {
      Frame.addParent(this._builder, parent);
    }
    return Frame.endFrame(this._builder);
  }

  public parseFrame(frame: Frame): FrameDef {
    const clause = frame.filterBy(new FilterClause());
    const parent = frame.parent(new Frame());
    return {
      name: <string>frame.name(),
      source: <string>frame.source(),
      limit: Number(frame.limit()),
      offset: Number(frame.offset()),
      fields: this._field.parseFields(
        frame.fields.bind(frame),
        frame.fieldsLength(),
      ),
      filterBy: clause
        ? this._filter.parseFilterClause(clause)
        : undefined,
      groupBy: this._field.parseFields(
        frame.groupBy.bind(frame),
        frame.groupByLength(),
      ),
      splitBy: this._field.parseFields(
        frame.splitBy.bind(frame),
        frame.splitByLength(),
      ),
      sortBy: this._field.parseFields(
        frame.sortBy.bind(frame),
        frame.sortByLength(),
      ),
      parent: parent ? this.parseFrame(parent) : undefined,
    };
  }
}

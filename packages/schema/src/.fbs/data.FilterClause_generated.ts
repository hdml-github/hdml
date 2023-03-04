// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import {FilterName as FilterName} from './enum.FilterName_generated.js';
import {FilterOperator as FilterOperator} from './enum.FilterOperator_generated.js';
import {FilterType as FilterType} from './enum.FilterType_generated.js';

/**
 * Filter options union type.
 */
export enum FilterOpts {
  NONE = 0,
  ExprOpts = 1,
  KeysOpts = 2,
  NamedOpts = 3
}

export function unionToFilterOpts(
  type: FilterOpts,
  accessor: (obj:ExprOpts|KeysOpts|NamedOpts) => ExprOpts|KeysOpts|NamedOpts|null
): ExprOpts|KeysOpts|NamedOpts|null {
  switch(FilterOpts[type]) {
    case 'NONE': return null; 
    case 'ExprOpts': return accessor(new ExprOpts())! as ExprOpts;
    case 'KeysOpts': return accessor(new KeysOpts())! as KeysOpts;
    case 'NamedOpts': return accessor(new NamedOpts())! as NamedOpts;
    default: return null;
  }
}

export function unionListToFilterOpts(
  type: FilterOpts, 
  accessor: (index: number, obj:ExprOpts|KeysOpts|NamedOpts) => ExprOpts|KeysOpts|NamedOpts|null, 
  index: number
): ExprOpts|KeysOpts|NamedOpts|null {
  switch(FilterOpts[type]) {
    case 'NONE': return null; 
    case 'ExprOpts': return accessor(index, new ExprOpts())! as ExprOpts;
    case 'KeysOpts': return accessor(index, new KeysOpts())! as KeysOpts;
    case 'NamedOpts': return accessor(index, new NamedOpts())! as NamedOpts;
    default: return null;
  }
}

/**
 * Search expression options type.
 */
export class ExprOpts {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):ExprOpts {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsExprOpts(bb:flatbuffers.ByteBuffer, obj?:ExprOpts):ExprOpts {
  return (obj || new ExprOpts()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsExprOpts(bb:flatbuffers.ByteBuffer, obj?:ExprOpts):ExprOpts {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new ExprOpts()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

clause():string|null
clause(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
clause(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

static startExprOpts(builder:flatbuffers.Builder) {
  builder.startObject(1);
}

static addClause(builder:flatbuffers.Builder, clauseOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, clauseOffset, 0);
}

static endExprOpts(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createExprOpts(builder:flatbuffers.Builder, clauseOffset:flatbuffers.Offset):flatbuffers.Offset {
  ExprOpts.startExprOpts(builder);
  ExprOpts.addClause(builder, clauseOffset);
  return ExprOpts.endExprOpts(builder);
}
}

/**
 * Search keys options type.
 */
export class KeysOpts {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):KeysOpts {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsKeysOpts(bb:flatbuffers.ByteBuffer, obj?:KeysOpts):KeysOpts {
  return (obj || new KeysOpts()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsKeysOpts(bb:flatbuffers.ByteBuffer, obj?:KeysOpts):KeysOpts {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new KeysOpts()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

left():string|null
left(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
left(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

right():string|null
right(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
right(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

static startKeysOpts(builder:flatbuffers.Builder) {
  builder.startObject(2);
}

static addLeft(builder:flatbuffers.Builder, leftOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, leftOffset, 0);
}

static addRight(builder:flatbuffers.Builder, rightOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, rightOffset, 0);
}

static endKeysOpts(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createKeysOpts(builder:flatbuffers.Builder, leftOffset:flatbuffers.Offset, rightOffset:flatbuffers.Offset):flatbuffers.Offset {
  KeysOpts.startKeysOpts(builder);
  KeysOpts.addLeft(builder, leftOffset);
  KeysOpts.addRight(builder, rightOffset);
  return KeysOpts.endKeysOpts(builder);
}
}

/**
 * Search named filter options type.
 */
export class NamedOpts {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):NamedOpts {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsNamedOpts(bb:flatbuffers.ByteBuffer, obj?:NamedOpts):NamedOpts {
  return (obj || new NamedOpts()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsNamedOpts(bb:flatbuffers.ByteBuffer, obj?:NamedOpts):NamedOpts {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new NamedOpts()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

name():FilterName {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.readInt8(this.bb_pos + offset) : FilterName.Equals;
}

field():string|null
field(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
field(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

values(index: number):string
values(index: number,optionalEncoding:flatbuffers.Encoding):string|Uint8Array
values(index: number,optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__string(this.bb!.__vector(this.bb_pos + offset) + index * 4, optionalEncoding) : null;
}

valuesLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

static startNamedOpts(builder:flatbuffers.Builder) {
  builder.startObject(3);
}

static addName(builder:flatbuffers.Builder, name:FilterName) {
  builder.addFieldInt8(0, name, FilterName.Equals);
}

static addField(builder:flatbuffers.Builder, fieldOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, fieldOffset, 0);
}

static addValues(builder:flatbuffers.Builder, valuesOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, valuesOffset, 0);
}

static createValuesVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startValuesVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static endNamedOpts(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createNamedOpts(builder:flatbuffers.Builder, name:FilterName, fieldOffset:flatbuffers.Offset, valuesOffset:flatbuffers.Offset):flatbuffers.Offset {
  NamedOpts.startNamedOpts(builder);
  NamedOpts.addName(builder, name);
  NamedOpts.addField(builder, fieldOffset);
  NamedOpts.addValues(builder, valuesOffset);
  return NamedOpts.endNamedOpts(builder);
}
}

/**
 * Filter type.
 */
export class Filter {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):Filter {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsFilter(bb:flatbuffers.ByteBuffer, obj?:Filter):Filter {
  return (obj || new Filter()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsFilter(bb:flatbuffers.ByteBuffer, obj?:Filter):Filter {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new Filter()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

type():FilterType {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.readInt8(this.bb_pos + offset) : FilterType.Expr;
}

optionsType():FilterOpts {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.readUint8(this.bb_pos + offset) : FilterOpts.NONE;
}

options<T extends flatbuffers.Table>(obj:any):any|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__union(obj, this.bb_pos + offset) : null;
}

static startFilter(builder:flatbuffers.Builder) {
  builder.startObject(3);
}

static addType(builder:flatbuffers.Builder, type:FilterType) {
  builder.addFieldInt8(0, type, FilterType.Expr);
}

static addOptionsType(builder:flatbuffers.Builder, optionsType:FilterOpts) {
  builder.addFieldInt8(1, optionsType, FilterOpts.NONE);
}

static addOptions(builder:flatbuffers.Builder, optionsOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, optionsOffset, 0);
}

static endFilter(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createFilter(builder:flatbuffers.Builder, type:FilterType, optionsType:FilterOpts, optionsOffset:flatbuffers.Offset):flatbuffers.Offset {
  Filter.startFilter(builder);
  Filter.addType(builder, type);
  Filter.addOptionsType(builder, optionsType);
  Filter.addOptions(builder, optionsOffset);
  return Filter.endFilter(builder);
}
}

/**
 * Filter clause type.
 */
export class FilterClause {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):FilterClause {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsFilterClause(bb:flatbuffers.ByteBuffer, obj?:FilterClause):FilterClause {
  return (obj || new FilterClause()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsFilterClause(bb:flatbuffers.ByteBuffer, obj?:FilterClause):FilterClause {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new FilterClause()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

type():FilterOperator {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.readInt8(this.bb_pos + offset) : FilterOperator.Or;
}

filters(index: number, obj?:Filter):Filter|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? (obj || new Filter()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

filtersLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

children(index: number, obj?:FilterClause):FilterClause|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? (obj || new FilterClause()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

childrenLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

static startFilterClause(builder:flatbuffers.Builder) {
  builder.startObject(3);
}

static addType(builder:flatbuffers.Builder, type:FilterOperator) {
  builder.addFieldInt8(0, type, FilterOperator.Or);
}

static addFilters(builder:flatbuffers.Builder, filtersOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, filtersOffset, 0);
}

static createFiltersVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startFiltersVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addChildren(builder:flatbuffers.Builder, childrenOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, childrenOffset, 0);
}

static createChildrenVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startChildrenVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static endFilterClause(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createFilterClause(builder:flatbuffers.Builder, type:FilterOperator, filtersOffset:flatbuffers.Offset, childrenOffset:flatbuffers.Offset):flatbuffers.Offset {
  FilterClause.startFilterClause(builder);
  FilterClause.addType(builder, type);
  FilterClause.addFilters(builder, filtersOffset);
  FilterClause.addChildren(builder, childrenOffset);
  return FilterClause.endFilterClause(builder);
}
}


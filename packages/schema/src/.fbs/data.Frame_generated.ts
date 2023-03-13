// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import {Field as Field} from './data.Field_generated.js';
import {FilterClause as FilterClause} from './data.FilterClause_generated.js';

/**
 * Data frame type.
 */
export class Frame {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):Frame {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsFrame(bb:flatbuffers.ByteBuffer, obj?:Frame):Frame {
  return (obj || new Frame()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsFrame(bb:flatbuffers.ByteBuffer, obj?:Frame):Frame {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new Frame()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

name():string|null
name(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
name(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

host():string|null
host(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
host(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

source():string|null
source(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
source(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

limit():bigint {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? this.bb!.readUint64(this.bb_pos + offset) : BigInt('0');
}

fields(index: number, obj?:Field):Field|null {
  const offset = this.bb!.__offset(this.bb_pos, 12);
  return offset ? (obj || new Field()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

fieldsLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 12);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

filter(obj?:FilterClause):FilterClause|null {
  const offset = this.bb!.__offset(this.bb_pos, 14);
  return offset ? (obj || new FilterClause()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

groupBy(index: number, obj?:Field):Field|null {
  const offset = this.bb!.__offset(this.bb_pos, 16);
  return offset ? (obj || new Field()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

groupByLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 16);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

splitBy(index: number, obj?:Field):Field|null {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? (obj || new Field()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

splitByLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

sortBy(index: number, obj?:Field):Field|null {
  const offset = this.bb!.__offset(this.bb_pos, 20);
  return offset ? (obj || new Field()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

sortByLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 20);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

children(index: number, obj?:Frame):Frame|null {
  const offset = this.bb!.__offset(this.bb_pos, 22);
  return offset ? (obj || new Frame()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

childrenLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 22);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

static startFrame(builder:flatbuffers.Builder) {
  builder.startObject(10);
}

static addName(builder:flatbuffers.Builder, nameOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, nameOffset, 0);
}

static addHost(builder:flatbuffers.Builder, hostOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, hostOffset, 0);
}

static addSource(builder:flatbuffers.Builder, sourceOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, sourceOffset, 0);
}

static addLimit(builder:flatbuffers.Builder, limit:bigint) {
  builder.addFieldInt64(3, limit, BigInt('0'));
}

static addFields(builder:flatbuffers.Builder, fieldsOffset:flatbuffers.Offset) {
  builder.addFieldOffset(4, fieldsOffset, 0);
}

static createFieldsVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startFieldsVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addFilter(builder:flatbuffers.Builder, filterOffset:flatbuffers.Offset) {
  builder.addFieldOffset(5, filterOffset, 0);
}

static addGroupBy(builder:flatbuffers.Builder, groupByOffset:flatbuffers.Offset) {
  builder.addFieldOffset(6, groupByOffset, 0);
}

static createGroupByVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startGroupByVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addSplitBy(builder:flatbuffers.Builder, splitByOffset:flatbuffers.Offset) {
  builder.addFieldOffset(7, splitByOffset, 0);
}

static createSplitByVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startSplitByVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addSortBy(builder:flatbuffers.Builder, sortByOffset:flatbuffers.Offset) {
  builder.addFieldOffset(8, sortByOffset, 0);
}

static createSortByVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startSortByVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addChildren(builder:flatbuffers.Builder, childrenOffset:flatbuffers.Offset) {
  builder.addFieldOffset(9, childrenOffset, 0);
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

static endFrame(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

}

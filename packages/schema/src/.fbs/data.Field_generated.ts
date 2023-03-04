// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import {AggType as AggType} from './enum.AggType_generated.js';
import {DataType as DataType} from './enum.DataType_generated.js';
import {DateUnit as DateUnit} from './enum.DateUnit_generated.js';
import {DecimalBitWidth as DecimalBitWidth} from './enum.DecimalBitWidth_generated.js';
import {TimeUnit as TimeUnit} from './enum.TimeUnit_generated.js';
import {TimeZone as TimeZone} from './enum.TimeZone_generated.js';

/**
 * Type options union.
 */
export enum TypeOpts {
  NONE = 0,
  CommonOpts = 1,
  DecimalOpts = 2,
  DateOpts = 3,
  TimeOpts = 4,
  TimestampOpts = 5
}

export function unionToTypeOpts(
  type: TypeOpts,
  accessor: (obj:CommonOpts|DateOpts|DecimalOpts|TimeOpts|TimestampOpts) => CommonOpts|DateOpts|DecimalOpts|TimeOpts|TimestampOpts|null
): CommonOpts|DateOpts|DecimalOpts|TimeOpts|TimestampOpts|null {
  switch(TypeOpts[type]) {
    case 'NONE': return null; 
    case 'CommonOpts': return accessor(new CommonOpts())! as CommonOpts;
    case 'DecimalOpts': return accessor(new DecimalOpts())! as DecimalOpts;
    case 'DateOpts': return accessor(new DateOpts())! as DateOpts;
    case 'TimeOpts': return accessor(new TimeOpts())! as TimeOpts;
    case 'TimestampOpts': return accessor(new TimestampOpts())! as TimestampOpts;
    default: return null;
  }
}

export function unionListToTypeOpts(
  type: TypeOpts, 
  accessor: (index: number, obj:CommonOpts|DateOpts|DecimalOpts|TimeOpts|TimestampOpts) => CommonOpts|DateOpts|DecimalOpts|TimeOpts|TimestampOpts|null, 
  index: number
): CommonOpts|DateOpts|DecimalOpts|TimeOpts|TimestampOpts|null {
  switch(TypeOpts[type]) {
    case 'NONE': return null; 
    case 'CommonOpts': return accessor(index, new CommonOpts())! as CommonOpts;
    case 'DecimalOpts': return accessor(index, new DecimalOpts())! as DecimalOpts;
    case 'DateOpts': return accessor(index, new DateOpts())! as DateOpts;
    case 'TimeOpts': return accessor(index, new TimeOpts())! as TimeOpts;
    case 'TimestampOpts': return accessor(index, new TimestampOpts())! as TimestampOpts;
    default: return null;
  }
}

/**
 * Common types options structure.
 */
export class CommonOpts {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):CommonOpts {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

nullable():boolean {
  return !!this.bb!.readInt8(this.bb_pos);
}

static sizeOf():number {
  return 1;
}

static createCommonOpts(builder:flatbuffers.Builder, nullable: boolean):flatbuffers.Offset {
  builder.prep(1, 1);
  builder.writeInt8(Number(Boolean(nullable)));
  return builder.offset();
}

}

/**
 * Decimal type options structure.
 */
export class DecimalOpts {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):DecimalOpts {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

nullable():boolean {
  return !!this.bb!.readInt8(this.bb_pos);
}

scale():number {
  return this.bb!.readUint16(this.bb_pos + 2);
}

precision():number {
  return this.bb!.readUint16(this.bb_pos + 4);
}

bitWidth():DecimalBitWidth {
  return this.bb!.readInt8(this.bb_pos + 6);
}

static sizeOf():number {
  return 8;
}

static createDecimalOpts(builder:flatbuffers.Builder, nullable: boolean, scale: number, precision: number, bit_width: DecimalBitWidth):flatbuffers.Offset {
  builder.prep(2, 8);
  builder.pad(1);
  builder.writeInt8(bit_width);
  builder.writeInt16(precision);
  builder.writeInt16(scale);
  builder.pad(1);
  builder.writeInt8(Number(Boolean(nullable)));
  return builder.offset();
}

}

/**
 *  Date type options structure.
 */
export class DateOpts {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):DateOpts {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

nullable():boolean {
  return !!this.bb!.readInt8(this.bb_pos);
}

unit():DateUnit {
  return this.bb!.readInt8(this.bb_pos + 1);
}

static sizeOf():number {
  return 2;
}

static createDateOpts(builder:flatbuffers.Builder, nullable: boolean, unit: DateUnit):flatbuffers.Offset {
  builder.prep(1, 2);
  builder.writeInt8(unit);
  builder.writeInt8(Number(Boolean(nullable)));
  return builder.offset();
}

}

/**
 * DateTime type options structure.
 */
export class TimeOpts {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):TimeOpts {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

nullable():boolean {
  return !!this.bb!.readInt8(this.bb_pos);
}

unit():TimeUnit {
  return this.bb!.readInt8(this.bb_pos + 1);
}

static sizeOf():number {
  return 2;
}

static createTimeOpts(builder:flatbuffers.Builder, nullable: boolean, unit: TimeUnit):flatbuffers.Offset {
  builder.prep(1, 2);
  builder.writeInt8(unit);
  builder.writeInt8(Number(Boolean(nullable)));
  return builder.offset();
}

}

/**
 * Timstamp type options structure.
 */
export class TimestampOpts {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):TimestampOpts {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

nullable():boolean {
  return !!this.bb!.readInt8(this.bb_pos);
}

unit():TimeUnit {
  return this.bb!.readInt8(this.bb_pos + 1);
}

timezone():TimeZone {
  return this.bb!.readInt16(this.bb_pos + 2);
}

static sizeOf():number {
  return 4;
}

static createTimestampOpts(builder:flatbuffers.Builder, nullable: boolean, unit: TimeUnit, timezone: TimeZone):flatbuffers.Offset {
  builder.prep(2, 4);
  builder.writeInt16(timezone);
  builder.writeInt8(unit);
  builder.writeInt8(Number(Boolean(nullable)));
  return builder.offset();
}

}

/**
 * Field data type description.
 */
export class Type {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):Type {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsType(bb:flatbuffers.ByteBuffer, obj?:Type):Type {
  return (obj || new Type()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsType(bb:flatbuffers.ByteBuffer, obj?:Type):Type {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new Type()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

type():DataType {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.readInt8(this.bb_pos + offset) : DataType.Int8;
}

optionsType():TypeOpts {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.readUint8(this.bb_pos + offset) : TypeOpts.NONE;
}

options<T extends flatbuffers.Table>(obj:any):any|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__union(obj, this.bb_pos + offset) : null;
}

static startType(builder:flatbuffers.Builder) {
  builder.startObject(3);
}

static addType(builder:flatbuffers.Builder, type:DataType) {
  builder.addFieldInt8(0, type, DataType.Int8);
}

static addOptionsType(builder:flatbuffers.Builder, optionsType:TypeOpts) {
  builder.addFieldInt8(1, optionsType, TypeOpts.NONE);
}

static addOptions(builder:flatbuffers.Builder, optionsOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, optionsOffset, 0);
}

static endType(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createType(builder:flatbuffers.Builder, type:DataType, optionsType:TypeOpts, optionsOffset:flatbuffers.Offset):flatbuffers.Offset {
  Type.startType(builder);
  Type.addType(builder, type);
  Type.addOptionsType(builder, optionsType);
  Type.addOptions(builder, optionsOffset);
  return Type.endType(builder);
}
}

/**
 * Field description.
 */
export class Field {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):Field {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsField(bb:flatbuffers.ByteBuffer, obj?:Field):Field {
  return (obj || new Field()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsField(bb:flatbuffers.ByteBuffer, obj?:Field):Field {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new Field()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

description():string|null
description(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
description(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

origin():string|null
origin(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
origin(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

clause():string|null
clause(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
clause(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

name():string|null
name(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
name(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

type(obj?:Type):Type|null {
  const offset = this.bb!.__offset(this.bb_pos, 12);
  return offset ? (obj || new Type()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

agg():AggType {
  const offset = this.bb!.__offset(this.bb_pos, 14);
  return offset ? this.bb!.readInt8(this.bb_pos + offset) : AggType.Count;
}

asc():boolean {
  const offset = this.bb!.__offset(this.bb_pos, 16);
  return offset ? !!this.bb!.readInt8(this.bb_pos + offset) : false;
}

static startField(builder:flatbuffers.Builder) {
  builder.startObject(7);
}

static addDescription(builder:flatbuffers.Builder, descriptionOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, descriptionOffset, 0);
}

static addOrigin(builder:flatbuffers.Builder, originOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, originOffset, 0);
}

static addClause(builder:flatbuffers.Builder, clauseOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, clauseOffset, 0);
}

static addName(builder:flatbuffers.Builder, nameOffset:flatbuffers.Offset) {
  builder.addFieldOffset(3, nameOffset, 0);
}

static addType(builder:flatbuffers.Builder, typeOffset:flatbuffers.Offset) {
  builder.addFieldOffset(4, typeOffset, 0);
}

static addAgg(builder:flatbuffers.Builder, agg:AggType) {
  builder.addFieldInt8(5, agg, AggType.Count);
}

static addAsc(builder:flatbuffers.Builder, asc:boolean) {
  builder.addFieldInt8(6, +asc, +false);
}

static endField(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

}


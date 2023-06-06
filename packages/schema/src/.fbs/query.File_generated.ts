// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';


/**
 * `HDML` network protocol file structure.
 */
export class File {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):File {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsFile(bb:flatbuffers.ByteBuffer, obj?:File):File {
  return (obj || new File()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsFile(bb:flatbuffers.ByteBuffer, obj?:File):File {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new File()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

name():string|null
name(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
name(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

static startFile(builder:flatbuffers.Builder) {
  builder.startObject(1);
}

static addName(builder:flatbuffers.Builder, nameOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, nameOffset, 0);
}

static endFile(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createFile(builder:flatbuffers.Builder, nameOffset:flatbuffers.Offset):flatbuffers.Offset {
  File.startFile(builder);
  File.addName(builder, nameOffset);
  return File.endFile(builder);
}
}


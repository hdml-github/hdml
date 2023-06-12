/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { ByteBuffer, Builder } from "flatbuffers";
import { File as _File } from "./.fbs/query.File_generated";

/**
 * An object for defining file.
 */
export type FileDef = {
  name: string;
};

/**
 * File helper class.
 */
export class File {
  private _builder: Builder;
  private _buffer: ByteBuffer;
  private _file: _File;

  public get buffer(): Uint8Array {
    return this._buffer.bytes();
  }

  public get name(): string {
    return this._file.name() || "";
  }

  constructor(file: FileDef | Uint8Array) {
    this._builder = new Builder(1024);
    if (file instanceof Uint8Array) {
      this._buffer = new ByteBuffer(file);
    } else {
      const name = this._builder.createString(file.name);
      _File.startFile(this._builder);
      _File.addName(this._builder, name);
      this._builder.finish(_File.endFile(this._builder));
      this._buffer = new ByteBuffer(this._builder.asUint8Array());
    }
    this._file = _File.getRootAsFile(this._buffer);
  }
}

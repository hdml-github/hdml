/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { ByteBuffer, Builder } from "flatbuffers";
import { Path as _Path } from "./.fbs/query.Path_generated";

/**
 * An object for defining file.
 */
export type QueryPathDef = {
  uri: string;
};

/**
 * Path helper class.
 */
export class QueryPathBuf {
  private _builder: Builder;
  private _buffer: ByteBuffer;
  private _path: _Path;

  public get buffer(): Uint8Array {
    return this._buffer.bytes();
  }

  public get uri(): string {
    return this._path.uri() || "";
  }

  constructor(path: QueryPathDef | Uint8Array) {
    this._builder = new Builder(1024);
    if (path instanceof Uint8Array) {
      this._buffer = new ByteBuffer(path);
    } else {
      const uri = this._builder.createString(path.uri);
      _Path.startPath(this._builder);
      _Path.addUri(this._builder, uri);
      this._builder.finish(_Path.endPath(this._builder));
      this._buffer = new ByteBuffer(this._builder.asUint8Array());
    }
    this._path = _Path.getRootAsPath(this._buffer);
  }
}

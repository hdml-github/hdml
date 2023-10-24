/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { ByteBuffer, Builder } from "flatbuffers";
import { Query as _Query } from "./.fbs/query.Query_generated";
import { Model } from "./.fbs/query.Model_generated";
import { Frame } from "./.fbs/query.Frame_generated";
import { ModelHelper, ModelDef } from "./helpers/ModelHelper";
import { FrameHelper, FrameDef } from "./helpers/FrameHelper";

/**
 * An object for defining query.
 */
export type QueryDef = {
  model?: ModelDef;
  frame?: FrameDef;
};

/**
 * Query helper class.
 * QueryBuf/QueryDef
 */
export class Query {
  private _builder: Builder;
  private _buffer: ByteBuffer;
  private _model: ModelHelper;
  private _frame: FrameHelper;
  private _query: _Query;

  public get buffer(): Uint8Array {
    return this._buffer.bytes();
  }

  public get model(): undefined | ModelDef {
    const model = this._query.model(new Model());
    if (model) {
      return this._model.parseModel(model);
    }
    return;
  }

  public get frame(): undefined | FrameDef {
    const frame = this._query.frame(new Frame());
    if (frame) {
      return this._frame.parseFrame(frame);
    }
    return;
  }

  constructor(data: Uint8Array | QueryDef) {
    this._builder = new Builder(1024);
    this._model = new ModelHelper(this._builder);
    this._frame = new FrameHelper(this._builder);
    if (data instanceof Uint8Array) {
      this._buffer = new ByteBuffer(data);
      this._query = _Query.getRootAsQuery(this._buffer);
    } else {
      let model: undefined | number;
      if (data.model) {
        model = this._model.bufferizeModel(data.model);
      }
      let frame: undefined | number;
      if (data.frame) {
        frame = this._frame.bufferizeFrame(data.frame);
      }
      _Query.startQuery(this._builder);
      if (model) {
        _Query.addModel(this._builder, model);
      }
      if (frame) {
        _Query.addFrame(this._builder, frame);
      }
      this._builder.finish(_Query.endQuery(this._builder));
      this._buffer = new ByteBuffer(this._builder.asUint8Array());
      this._query = _Query.getRootAsQuery(this._buffer);
    }
  }
}

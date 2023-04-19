import { ByteBuffer, Builder } from "flatbuffers";
import { Doc } from "./.fbs/data.Doc_generated";
import { Model } from "./.fbs/data.Model_generated";
import { Frame } from "./.fbs/data.Frame_generated";
import { ModelHelper, ModelData } from "./helpers/ModelHelper";
import { FrameHelper, FrameData } from "./helpers/FrameHelper";

export type DocumentData =
  | Uint8Array
  | {
      name: string;
      tenant: string;
      token: string;
      model: ModelData;
      frame: FrameData;
    };

export class Document {
  private _buffer: ByteBuffer;
  private _builder: Builder;
  private _document: Doc;
  private _model: ModelHelper;
  private _frame: FrameHelper;

  public get buffer(): Uint8Array {
    return this._buffer.bytes();
  }

  public get name(): string {
    return this._document.name() || "";
  }

  public get tenant(): string {
    return this._document.tenant() || "";
  }

  public get token(): string {
    return this._document.token() || "";
  }

  public get model(): undefined | ModelData {
    const model = this._document.model(new Model());
    if (model) {
      return this._model.parseModel(model);
    }
    return;
  }

  public get frame(): undefined | FrameData {
    const frame = this._document.frame(new Frame());
    if (frame) {
      return this._frame.parseFrame(frame);
    }
    return;
  }

  constructor(data: DocumentData) {
    this._builder = new Builder(1024);
    this._model = new ModelHelper(this._builder);
    this._frame = new FrameHelper(this._builder);
    if (data instanceof Uint8Array) {
      this._buffer = new ByteBuffer(data);
      this._document = Doc.getRootAsDoc(this._buffer);
    } else {
      const name = this._builder.createString(data.name);
      const tenant = this._builder.createString(data.tenant);
      const token = this._builder.createString(data.token);
      const model = this._model.bufferizeModel(data.model);
      const frame = this._frame.bufferizeFrame(data.frame);
      Doc.startDoc(this._builder);
      Doc.addName(this._builder, name);
      Doc.addTenant(this._builder, tenant);
      Doc.addToken(this._builder, token);
      Doc.addModel(this._builder, model);
      Doc.addFrame(this._builder, frame);
      this._builder.finish(Doc.endDoc(this._builder));
      this._buffer = new ByteBuffer(this._builder.asUint8Array());
      this._document = Doc.getRootAsDoc(this._buffer);
    }
  }
}

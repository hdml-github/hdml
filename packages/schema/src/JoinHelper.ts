import { Builder } from "flatbuffers";
import { Join } from "./.fbs/data.Model_generated";
import {
  FilterName,
  FilterOperator,
  FilterType,
  JoinType,
} from "./Enums";

export type ExprOptsData = {
  clause: string;
};

export type KeysOptsData = {
  left: string;
  right: string;
};

export type NamedOptsData = {
  name: FilterName;
  field: string;
  values: string[];
};

export type FilterData =
  | {
      type: FilterType.Expr;
      options: ExprOptsData;
    }
  | {
      type: FilterType.Keys;
      options: KeysOptsData;
    }
  | {
      type: FilterType.Named;
      options: NamedOptsData;
    };

export type FilterClauseData = {
  type: FilterOperator;
  filters: FilterData[];
  children: FilterClauseData[];
};

export type JoinData = {
  type: JoinType;
  left: string;
  right: string;
  filter: FilterClauseData;
};

export class JoinHelper {
  public constructor(private _builder: Builder) {}

  public bufferizeJoins(data: JoinData[]): number[] {
    return data.map((j) => this.bufferizeJoin(j));
  }

  public bufferizeJoin(data: JoinData): number {
    const left = this._builder.createString(data.left);
    const right = this._builder.createString(data.right);

    Join.startJoin(this._builder);
    Join.addType(this._builder, data.type);
    Join.addLeft(this._builder, left);
    Join.addRight(this._builder, right);

    return Join.endJoin(this._builder);
  }
}

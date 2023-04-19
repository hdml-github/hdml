import { Builder } from "flatbuffers";
import { Join, Model } from "../.fbs/data.Model_generated";
import { FilterClause } from "../.fbs/data.FilterClause_generated";
import { JoinType } from "../Enums";
import { FilterHelper, FilterClauseData } from "./FilterHelper";

export type JoinData = {
  type: JoinType;
  left: string;
  right: string;
  clause: FilterClauseData;
};

export class JoinHelper {
  private _filter: FilterHelper;

  public constructor(private _builder: Builder) {
    this._filter = new FilterHelper(this._builder);
  }

  public bufferizeJoins(data: JoinData[]): number[] {
    return data.map((j) => this.bufferizeJoin(j));
  }

  public bufferizeJoin(data: JoinData): number {
    const left = this._builder.createString(data.left);
    const right = this._builder.createString(data.right);
    const clause = this._filter.bufferizeFilterClause(data.clause);
    Join.startJoin(this._builder);
    Join.addType(this._builder, data.type);
    Join.addLeft(this._builder, left);
    Join.addRight(this._builder, right);
    Join.addClause(this._builder, clause);
    return Join.endJoin(this._builder);
  }

  public parseJoins(model: Model): JoinData[] {
    const joins: JoinData[] = [];
    for (let i = 0; i < model.joinsLength(); i++) {
      const join = model.joins(i, new Join());
      if (!join) {
        throw new Error("Invalid join.");
      }
      const clause = join.clause(new FilterClause());
      if (!clause) {
        throw new Error("Invalid filter clause.");
      }
      joins.push({
        type: join.type(),
        left: join.left() || "",
        right: join.right() || "",
        clause: this._filter.parseFilterClause(clause),
      });
    }
    return joins;
  }
}

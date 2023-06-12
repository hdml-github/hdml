/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Builder } from "flatbuffers";
import { Join, Model } from "../.fbs/query.Model_generated";
import { FilterClause } from "../.fbs/query.FilterClause_generated";
import { JoinType } from "../enums";
import { FilterHelper, FilterClauseDef } from "./FilterHelper";

/**
 * An object for defining join.
 */
export type JoinDef = {
  type: JoinType;
  left: string;
  right: string;
  clause: FilterClauseDef;
};

/**
 * Join helper class.
 */
export class JoinHelper {
  private _filter: FilterHelper;

  public constructor(private _builder: Builder) {
    this._filter = new FilterHelper(this._builder);
  }

  public bufferizeJoins(data: JoinDef[]): number[] {
    return data.map((j) => this.bufferizeJoin(j));
  }

  public bufferizeJoin(data: JoinDef): number {
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

  public parseJoins(model: Model): JoinDef[] {
    const joins: JoinDef[] = [];
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

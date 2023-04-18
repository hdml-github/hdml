import { Builder } from "flatbuffers";
import { Join, Model } from "../.fbs/data.Model_generated";
import {
  FilterClause,
  Filter,
  FilterOpts,
  ExprOpts,
  KeysOpts,
  NamedOpts,
} from "../.fbs/data.FilterClause_generated";
import {
  FilterName,
  FilterOperator,
  FilterType,
  JoinType,
} from "../Enums";

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
  clause: FilterClauseData;
};

export class JoinHelper {
  public constructor(private _builder: Builder) {}

  public bufferizeJoins(data: JoinData[]): number[] {
    return data.map((j) => this.bufferizeJoin(j));
  }

  public bufferizeJoin(data: JoinData): number {
    const left = this._builder.createString(data.left);
    const right = this._builder.createString(data.right);
    const clause = this.bufferizeFilterClause(data.clause);
    Join.startJoin(this._builder);
    Join.addType(this._builder, data.type);
    Join.addLeft(this._builder, left);
    Join.addRight(this._builder, right);
    Join.addClause(this._builder, clause);
    return Join.endJoin(this._builder);
  }

  public bufferizeFiltersClauses(data: FilterClauseData[]): number[] {
    return data.map((c) => this.bufferizeFilterClause(c));
  }

  public bufferizeFilterClause(data: FilterClauseData): number {
    const filters_ = this.bufferizeFilters(data.filters);
    const filters = FilterClause.createFiltersVector(
      this._builder,
      filters_,
    );
    const children_ = this.bufferizeFiltersClauses(data.children);
    const children = FilterClause.createChildrenVector(
      this._builder,
      children_,
    );
    FilterClause.startFilterClause(this._builder);
    FilterClause.addType(this._builder, data.type);
    FilterClause.addFilters(this._builder, filters);
    FilterClause.addChildren(this._builder, children);
    return FilterClause.endFilterClause(this._builder);
  }

  public bufferizeFilters(data: FilterData[]): number[] {
    return data.map((f) => this.bufferizeFilter(f));
  }

  public bufferizeFilter(data: FilterData): number {
    let type = FilterOpts.NONE;
    let opts = 0;
    switch (data.type) {
      default:
        break;
      case FilterType.Expr:
        type = FilterOpts.ExprOpts;
        opts = this.bufferizeExprOpts(data.options);
        break;
      case FilterType.Keys:
        type = FilterOpts.KeysOpts;
        opts = this.bufferizeKeysOpts(data.options);
        break;
      case FilterType.Named:
        type = FilterOpts.NamedOpts;
        opts = this.bufferizeNamedOpts(data.options);
        break;
    }
    Filter.startFilter(this._builder);
    Filter.addType(this._builder, data.type);
    Filter.addOptionsType(this._builder, type);
    Filter.addOptions(this._builder, opts);
    return Filter.endFilter(this._builder);
  }

  public bufferizeExprOpts(data: ExprOptsData): number {
    const clause = this._builder.createString(data.clause);
    ExprOpts.startExprOpts(this._builder);
    ExprOpts.addClause(this._builder, clause);
    return ExprOpts.endExprOpts(this._builder);
  }

  public bufferizeKeysOpts(data: KeysOptsData): number {
    const left = this._builder.createString(data.left);
    const right = this._builder.createString(data.right);
    KeysOpts.startKeysOpts(this._builder);
    KeysOpts.addLeft(this._builder, left);
    KeysOpts.addRight(this._builder, right);
    return KeysOpts.endKeysOpts(this._builder);
  }

  public bufferizeNamedOpts(data: NamedOptsData): number {
    const field = this._builder.createString(data.field);
    const values_ = data.values.map((v) =>
      this._builder.createString(v),
    );
    const values = NamedOpts.createValuesVector(
      this._builder,
      values_,
    );
    NamedOpts.startNamedOpts(this._builder);
    NamedOpts.addName(this._builder, data.name);
    NamedOpts.addField(this._builder, field);
    NamedOpts.addValues(this._builder, values);
    return NamedOpts.endNamedOpts(this._builder);
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
        clause: this.parseFilterClause(clause),
      });
    }
    return joins;
  }

  public parseFilterClause(clause: FilterClause): FilterClauseData {
    const type = clause.type();
    const filters: FilterData[] = [];
    const children: FilterClauseData[] = [];
    if (clause.filtersLength() > 0) {
      for (let i = 0; i < clause.filtersLength(); i++) {
        const filter = clause.filters(i, new Filter());
        if (filter) {
          filters.push(<FilterData>{
            type: filter.type(),
            options: this.parseFilterOpts(filter),
          });
        }
      }
    }
    if (clause.childrenLength() > 0) {
      for (let i = 0; i < clause.childrenLength(); i++) {
        const child = clause.children(i, new FilterClause());
        if (child) {
          children.push(this.parseFilterClause(child));
        }
      }
    }
    return {
      type,
      filters,
      children,
    };
  }

  public parseFilterOpts(
    filter: Filter,
  ): ExprOptsData | KeysOptsData | NamedOptsData {
    let opts: unknown;
    let data: ExprOptsData | KeysOptsData | NamedOptsData;
    switch (filter.optionsType()) {
      default:
        throw new Error("Invalid filter options type.");
      case FilterOpts.NONE:
        throw new Error("Invalid filter options type.");
      case FilterOpts.ExprOpts:
        opts = filter.options(new ExprOpts());
        data = {
          clause: <string>(<ExprOpts>opts).clause(),
        };
        return data;
      case FilterOpts.KeysOpts:
        opts = filter.options(new KeysOpts());
        data = {
          left: <string>(<KeysOpts>opts).left(),
          right: <string>(<KeysOpts>opts).right(),
        };
        return data;
      case FilterOpts.NamedOpts:
        opts = filter.options(new NamedOpts());
        data = {
          name: (<NamedOpts>opts).name(),
          field: <string>(<NamedOpts>opts).field(),
          values: <string[]>[],
        };
        for (let i = 0; i < (<NamedOpts>opts).valuesLength(); i++) {
          data.values.push((<NamedOpts>opts).values(i));
        }
        return data;
    }
  }
}

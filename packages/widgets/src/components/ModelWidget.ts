/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */

import cytoscape from "cytoscape";
import cise from "cytoscape-cise";
import cxtmenu from "cytoscape-cxtmenu";
import { debounce } from "throttle-debounce";
import { lit, ModelElement } from "@hdml/elements";
import {
  JoinDef,
  JoinType,
  FilterClauseDef,
  FilterOperator,
  FilterDef,
  FilterType,
} from "@hdml/schema";
import { getTablesEles } from "../helpers/getTablesEles";
import { getJoinsEles } from "../helpers/getJoinsEles";

cytoscape.use(<cytoscape.Ext>cise);
cytoscape.use(cxtmenu);

async function macrotask(): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });
}

export class ModelWidget extends ModelElement {
  /**
   * Component styles.
   */
  public static styles = lit.css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 400px;
    }
    :host > slot {
      display: inline-block;
      overflow: hidden;
      height: 0;
    }
    :host > div {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    :host > div > h2 {
      display: flex;
      flex-direction: row;
      margin: 0;
      white-space: nowrap;
    }
    :host > div > h2 > input {
      flex-grow: 1;
      margin: 0;
      padding: 0 0 0 8px;
      border: 0;
      outline: none;
      font-size: inherit;
      font-family: inherit;
      font-weight: inherit;
      color: inherit;
    }
    :host > div > div {
      position: relative;
      flex-grow: 1;
    }
  `;

  private _cy: null | cytoscape.Core = null;

  private _render: null | debounce<() => void> = null;

  private _styles = window.getComputedStyle(this);

  public connectedCallback(): void {
    super.connectedCallback();
    this._render = debounce(50, this.renderGraph);
    this.addEventListener("hdml-model:changed", this.dataListener);
  }

  public disconnectedCallback(): void {
    this._render && this._render.cancel();
    this._render = null;
    this.removeEventListener("hdml-model:changed", this.dataListener);
    super.disconnectedCallback();
  }

  public render(): lit.TemplateResult<1> {
    return lit.html`
      <slot></slot>
      <div>
        <h2>
          <div>Model name:</div>
          <input value=${this.name} @change=${this.nameListener} />
        </h2>
        <div id="cy"></div>
      </div>
    `;
  }

  private nameListener = (evt: Event): void => {
    const elm = <HTMLInputElement>evt.target;
    this.name = elm.value;
  };

  private dataListener = (): void => {
    this._render && this._render();
  };

  private renderGraph = async () => {
    const cy = await this.getCy();
    if (cy) {
      const eles = [
        ...getTablesEles(cy, this),
        ...getJoinsEles(cy, this),
      ];
      await this.updateCy(eles);
    }
  };

  private async processClause(
    index: number,
    parent: string,
    clause: FilterClauseDef,
    join: JoinDef,
  ) {
    const cy = await this.getCy();
    if (cy) {
      const nid = `${parent}:${this.getClauseName(
        clause.type,
      )}:${index}`;
      const eid = `${parent}-${nid}`;
      let cls = cy.$id(nid)[index];
      if (!cls) {
        cls = cy.add({
          group: "nodes",
          classes: ["clause"],
          data: {
            id: nid,
            name: this.getClauseName(clause.type),
          },
        });
      } else {
        cls.data("name", this.getClauseName(clause.type));
      }
      let lnk = cy.$id(eid)[0];
      if (!lnk) {
        lnk = cy.add({
          group: "edges",
          classes: ["join-clause"],
          data: {
            id: `${eid}`,
            source: parent,
            target: nid,
          },
        });
      }
      await Promise.all(
        clause.filters.map((filter, index) =>
          this.processFilter(index, nid, filter, join),
        ),
      );
      await Promise.all(
        clause.children.map((child, index) =>
          this.processClause(index, nid, child, join),
        ),
      );
    }
  }

  private async processFilter(
    index: number,
    parent: string,
    filter: FilterDef,
    join: JoinDef,
  ) {
    switch (filter.type) {
      case FilterType.Expr:
        return await this.processFilterExpr(
          index,
          parent,
          filter,
          join,
        );
      case FilterType.Keys:
        return await this.processFilterOn(
          index,
          parent,
          filter,
          join,
        );
      case FilterType.Named:
        return await this.processFilterNamed(
          index,
          parent,
          filter,
          join,
        );
    }
  }

  private async processFilterOn(
    index: number,
    parent: string,
    filter: FilterDef,
    join: JoinDef,
  ): Promise<void> {
    const cy = await this.getCy();
    if (cy) {
      const name = this.getFilterName(filter.type);
      const nid = `${parent}:${name}:${index}`;
      const eid = `${parent}-${nid}`;
      let flt = cy.$id(nid)[index];
      if (!flt) {
        flt = cy.add({
          group: "nodes",
          classes: ["filter", name],
          data: {
            id: nid,
            name,
          },
        });
      } else {
        flt.data("name", name);
      }
      let lnk = cy.$id(eid)[0];
      if (!lnk) {
        lnk = cy.add({
          group: "edges",
          classes: ["clause-filter"],
          data: {
            id: `${eid}`,
            source: parent,
            target: nid,
          },
        });
      }
    }
  }

  private async processFilterExpr(
    index: number,
    parent: string,
    filter: FilterDef,
    join: JoinDef,
  ): Promise<void> {
    return Promise.resolve();
  }

  private async processFilterNamed(
    index: number,
    parent: string,
    filter: FilterDef,
    join: JoinDef,
  ): Promise<void> {
    return Promise.resolve();
  }

  private async updateCy(
    eles: cytoscape.ElementDefinition[],
  ): Promise<void> {
    const cy = await this.getCy();
    if (cy) {
      cy.add(eles);
      cy.layout({
        name: "cose",
        animate: false,
        // idealEdgeLength: 100,
        // nodeOverlap: 20,
        // refresh: 20,
        // fit: true,
        // padding: 30,
        // randomize: false,
        // componentSpacing: 100,
        // nodeRepulsion: 400000,
        // edgeElasticity: 100,
        // nestingFactor: 5,
        // gravity: 80,
        // numIter: 1000,
        // initialTemp: 200,
        // coolingFactor: 0.95,
        // minTemp: 1.0,
      }).run();
      cy.center();
    }
  }

  private async getCy(): Promise<null | cytoscape.Core> {
    await macrotask();
    if (this._cy) {
      return this._cy;
    } else {
      return await new Promise<cytoscape.Core | null>((resolve) => {
        setTimeout(() => {
          if (!this._cy) {
            const host = this.renderRoot?.querySelector("#cy");
            if (host) {
              this._cy = cytoscape({
                container: <HTMLElement>host,
                zoom: 1,
                zoomingEnabled: false,
                style: [
                  // node.table
                  {
                    selector: "node.table",
                    style: {
                      label: "data(name)",
                      width: "150px",
                      height: "150px",
                      "font-size": "24px",
                      "font-weight": "bold",
                      "font-family": `${this._styles.fontFamily}`,
                      "text-valign": "center",
                      "text-halign": "center",
                      "border-color": "black",
                      "border-width": "2px",
                      "background-color": "white",
                      // @ts-ignore
                      "overlay-shape": "ellipse",
                    },
                  },
                  {
                    selector: "node.table:selected",
                    style: {
                      "border-width": "4px",
                    },
                  },
                  // node.field
                  {
                    selector: "node.field",
                    style: {
                      label: "data(name)",
                      width: "30px",
                      height: "30px",
                      "font-size": "18px",
                      "font-weight": "normal",
                      "font-family": `${this._styles.fontFamily}`,
                      "text-valign": "top",
                      "text-halign": "center",
                      "border-color": "black",
                      "border-width": "2px",
                      "background-color": "white",
                      // @ts-ignore
                      "overlay-shape": "ellipse",
                    },
                  },
                  {
                    selector: "node.field:selected",
                    style: {
                      "border-width": "4px",
                    },
                  },
                  // edge.table-field
                  {
                    selector: "edge.table-field",
                    style: {
                      width: "2px",
                      "line-color": "black",
                    },
                  },
                  {
                    selector: "edge.table-field:selected",
                    style: {
                      width: "4px",
                    },
                  },
                  // node.join
                  {
                    selector: "node.join",
                    style: {
                      label: "data(type)",
                      width: "80px",
                      height: "80px",
                      "font-size": "18px",
                      "font-weight": "normal",
                      "font-family": `${this._styles.fontFamily}`,
                      "text-valign": "center",
                      "text-halign": "center",
                      "border-color": "black",
                      "border-width": "1px",
                      // "border-style": "dashed",
                      "background-color": "white",
                      // @ts-ignore
                      "overlay-shape": "ellipse",
                    },
                  },
                  {
                    selector: "node.join:selected",
                    style: {
                      "border-width": "2px",
                    },
                  },
                  // edge.join-table
                  {
                    selector: "edge.join-table",
                    style: {
                      width: "1px",
                      "line-color": "black",
                      // "line-style": "dashed",
                    },
                  },
                  {
                    selector: "edge.join-table:selected",
                    style: {
                      width: "2px",
                    },
                  },
                  // node.clause
                  {
                    selector: "node.clause",
                    style: {
                      label: "data(name)",
                      width: "24px",
                      height: "24px",
                      "font-size": "18px",
                      "font-weight": "normal",
                      "font-family": `${this._styles.fontFamily}`,
                      "text-valign": "center",
                      "text-halign": "center",
                      "border-color": "black",
                      "border-width": "1px",
                      "background-color": "white",
                      // @ts-ignore
                      "overlay-shape": "ellipse",
                    },
                  },
                  {
                    selector: "node.clause:selected",
                    style: {
                      "border-width": "2px",
                    },
                  },
                  // edge.join-clause
                  {
                    selector: "edge.join-clause",
                    style: {
                      width: "1px",
                      "line-color": "black",
                    },
                  },
                  {
                    selector: "edge.join-clause:selected",
                    style: {
                      width: "2px",
                    },
                  },
                  // node.filter
                  {
                    selector: "node.filter",
                    style: {
                      label: "data(name)",
                      width: "40px",
                      height: "40px",
                      "font-size": "18px",
                      "font-weight": "normal",
                      "font-family": `${this._styles.fontFamily}`,
                      "text-valign": "center",
                      "text-halign": "center",
                      "border-color": "black",
                      "border-width": "1px",
                      "background-color": "white",
                      // @ts-ignore
                      "overlay-shape": "ellipse",
                    },
                  },
                  {
                    selector: "node.filter:selected",
                    style: {
                      "border-width": "2px",
                    },
                  },
                  {
                    selector: "edge.clause-filter",
                    style: {
                      width: "1px",
                      "line-color": "black",
                    },
                  },
                  {
                    selector: "edge.clause-filter:selected",
                    style: {
                      width: "2px",
                    },
                  },
                ],
              });
              this._cy.cxtmenu({
                selector: "node.table",
                indicatorSize: 0,
                adaptativeNodeSpotlightRadius: true,
                menuRadius: (ele: cytoscape.SingularData) => 100,
                commands: (ele) => [
                  {
                    content: "Edit",
                    select: (elm: cytoscape.SingularData) => {
                      //
                    },
                  },
                  {
                    content: "Delete",
                    select: (elm: cytoscape.SingularData) => {
                      //
                    },
                  },
                  {
                    content: "Show fields",
                    select: (elm: cytoscape.SingularData) => {
                      //
                    },
                  },
                  {
                    content: "Add field",
                    select: (elm: cytoscape.SingularData) => {
                      //
                    },
                  },
                  {
                    content: "Join",
                    select: (elm: cytoscape.SingularData) => {
                      //
                    },
                  },
                ],
              });
            }
          }
          resolve(this._cy);
        }, 0);
      });
    }
  }

  private getJoinName(type: JoinType): string {
    switch (type) {
      case JoinType.Cross:
        return "cross";
      case JoinType.Full:
        return "full";
      case JoinType.FullOuter:
        return "full outer";
      case JoinType.Inner:
        return "inner";
      case JoinType.Left:
        return "left";
      case JoinType.LeftOuter:
        return "left outer";
      case JoinType.Right:
        return "right";
      case JoinType.RightOuter:
        return "right outer";
    }
  }

  private getClauseName(type: FilterOperator): string {
    switch (type) {
      case FilterOperator.Or:
        return "|";
      case FilterOperator.And:
        return "&";
      case FilterOperator.None:
        return "none";
    }
  }

  private getFilterName(type: FilterType): string {
    switch (type) {
      case FilterType.Expr:
        return "expr";
      case FilterType.Keys:
        return "on";
      case FilterType.Named:
        return "named";
    }
  }
}

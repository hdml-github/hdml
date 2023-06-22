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
import { TableDef, FieldDef, JoinDef, JoinType } from "@hdml/schema";

cytoscape.use(<cytoscape.Ext>cise);
cytoscape.use(cxtmenu);

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
      await this.processTables();
      await this.processJoins();
      await this.updateCy();
    }
  };

  private async processTables() {
    const cy = await this.getCy();
    if (cy) {
      await this.removeUnusedTables();
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          Promise.all(
            this.data.tables.map((t) => this.processTable(t)),
          )
            .then(() => resolve())
            .catch(console.error);
        }, 0);
      });
    }
  }

  private async removeUnusedTables() {
    const cy = await this.getCy();
    if (cy) {
      cy.filter(".table").forEach(
        (ele: cytoscape.SingularElementReturnValue) => {
          if (!this.querySelector(`hdml-table[name=${ele.id()}]`)) {
            ele.remove();
          }
        },
      );
    }
  }

  private async processTable(table: TableDef) {
    const cy = await this.getCy();
    if (cy) {
      let tbl = cy.$id(table.name)[0];
      if (!tbl) {
        tbl = cy.add({
          group: "nodes",
          classes: ["table"],
          data: {
            id: table.name,
            name: table.name,
            type: table.type,
            source: table.source,
          },
        });
      } else {
        tbl.data("name", table.name);
        tbl.data("type", table.type);
        tbl.data("source", table.source);
      }
      await this.processFields(table);
    }
  }

  private async processFields(table: TableDef) {
    const cy = await this.getCy();
    if (cy) {
      await this.removeUnusedFields(table);
      await Promise.all(
        table.fields.map((f) => this.processField(table, f)),
      );
    }
  }

  private async removeUnusedFields(table: TableDef) {
    const cy = await this.getCy();
    if (cy) {
      cy.filter(`node.field[table="${table.name}"]`).forEach(
        (ele: cytoscape.SingularElementReturnValue) => {
          if (
            !this.querySelector(
              `hdml-table[name=${table.name}] ` +
                `hdml-field[name=${<string>ele.data("name")}]`,
            )
          ) {
            ele.remove();
          }
        },
      );
    }
  }

  private async processField(table: TableDef, field: FieldDef) {
    const cy = await this.getCy();
    if (cy) {
      let fld = cy.$id(`${table.name}.${field.name}`)[0];
      if (!fld) {
        fld = cy.add({
          group: "nodes",
          classes: ["field"],
          data: {
            id: `${table.name}.${field.name}`,
            table: table.name,
            name: field.name,
            description: field.description,
            origin: field.origin,
            clause: field.clause,
            type: field.type,
            agg: field.agg,
            asc: field.asc,
          },
        });
      } else {
        fld.data("table", table.name);
        fld.data("name", field.name);
        fld.data("description", field.description);
        fld.data("origin", field.origin);
        fld.data("clause", field.clause);
        fld.data("type", field.type);
        fld.data("agg", field.agg);
        fld.data("asc", field.asc);
      }
      let lnk = cy.$id(
        `${table.name}-${table.name}.${field.name}`,
      )[0];
      if (!lnk) {
        lnk = cy.add({
          group: "edges",
          classes: ["table-field"],
          data: {
            id: `${table.name}-${table.name}.${field.name}`,
            source: table.name,
            target: `${table.name}.${field.name}`,
          },
        });
      }
    }
  }

  private async processJoins() {
    const cy = await this.getCy();
    if (cy) {
      console.log(this.data.joins);
      // this.removeUnusedTables();
      // this.data.tables.forEach(this.processTable.bind(this));
      await Promise.all(
        this.data.joins.map((j) => this.processJoin(j)),
      );
    }
  }

  private async processJoin(join: JoinDef) {
    const cy = await this.getCy();
    if (cy) {
      const left = cy.$id(join.left)[0];
      const right = cy.$id(join.right)[0];
      if (!left || !right) {
        // TODO
        console.error("table missing");
      } else {
        let jn = cy.$id(`${join.left}:${join.right}`)[0];
        if (!jn) {
          jn = cy.add({
            group: "nodes",
            classes: ["join"],
            data: {
              id: `${join.left}:${join.right}`,
              left: join.left,
              right: join.right,
              type: this.getJoinName(join.type),
            },
          });
        } else {
          jn.data("left", join.left);
          jn.data("right", join.right);
          jn.data("type", this.getJoinName(join.type));
        }
        [join.left, join.right].forEach((tbl) => {
          let lnk = cy.$id(`${tbl}-${join.left}:${join.right}`)[0];
          if (!lnk) {
            lnk = cy.add({
              group: "edges",
              classes: ["join-table"],
              data: {
                id: `${tbl}-${join.left}:${join.right}`,
                source: tbl,
                target: `${join.left}:${join.right}`,
              },
            });
          }
        });
      }
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

  private async updateCy(): Promise<void> {
    const cy = await this.getCy();
    if (cy) {
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
}

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Core, ElementDefinition } from "cytoscape";
import { debounce } from "throttle-debounce";
import { lit, ModelElement } from "@hdml/elements";
import { getCytoscape } from "../helpers/getCytoscape";
import { getTablesEles } from "../helpers/getTablesEles";
import { getJoinsEles } from "../helpers/getJoinsEles";

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

  private _cy: null | Core = null;

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
      await this.updateCy([
        ...getTablesEles(cy, this),
        ...getJoinsEles(cy, this),
      ]);
    }
  };

  private async updateCy(eles: ElementDefinition[]): Promise<void> {
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

  private async getCy(): Promise<null | Core> {
    await macrotask();
    if (this._cy) {
      return this._cy;
    } else {
      return await new Promise<Core | null>((resolve) => {
        setTimeout(() => {
          if (!this._cy) {
            const host = this.renderRoot?.querySelector("#cy");
            if (host) {
              this._cy = getCytoscape(<HTMLElement>host);
            }
          }
          resolve(this._cy);
        }, 0);
      });
    }
  }
}

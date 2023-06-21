import cytoscape from "cytoscape";
import cxtmenu from "cytoscape-cxtmenu";
import { lit, ModelElement } from "@hdml/elements";

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

  // private _styles = window.getComputedStyle(this);

  private get _cyHost(): null | HTMLDivElement {
    return this.renderRoot?.querySelector("#cy") ?? null;
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("hdml-model:changed", this.dataListener);
  }

  public disconnectedCallback(): void {
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

  private dataListener = (evt: Event): void => {
    if (!this._cy) {
      const host = this.renderRoot?.querySelector("#cy");
      if (host) {
        this._cy = cytoscape({
          container: <HTMLElement>host,
          layout: {
            name: "grid",
          },
          style: [
            {
              selector: "node.table",
              style: {
                label: "data(name)",
                width: 100,
                height: 100,
                "font-weight": "bold",
                "text-valign": "center",
                "text-halign": "center",
                // eslint-disable-next-line max-len
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                "overlay-shape": "ellipse",
              },
            },
          ],
        });
        this._cy.cxtmenu({
          selector: "node.table",
          indicatorSize: 0,
          adaptativeNodeSpotlightRadius: true,
          menuRadius: (ele) => 100,
          commands: (ele) => [
            {
              content: "Edit",
              select: (elm) => {
                //
              },
            },
            {
              content: "Delete",
              select: (elm) => {
                //
              },
            },
            {
              content: "Show fields",
              select: (elm) => {
                //
              },
            },
            {
              content: "Add field",
              select: (elm) => {
                //
              },
            },
            {
              content: "Join",
              select: (elm) => {
                //
              },
            },
          ],
        });
      }
    }
  };
}

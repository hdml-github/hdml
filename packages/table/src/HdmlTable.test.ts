/**
 * @fileoverview Package's export test suite definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import HdmlTable from "./HdmlTable";

describe("<hdml-table></hdml-table>", () => {
  const ELEMENT_NODE = 1;
  let table: HdmlTable;
  let root: ShadowRoot;

  beforeEach(() => {
    table = new HdmlTable();
    document.body.appendChild(table);
  });

  afterEach(() => {
    table.remove();
  });

  test("DOM-attributes default values", () => {
    root = table.shadowRoot as ShadowRoot;
    expect(table.nodeType).toBe(ELEMENT_NODE);
    expect(table.tagName).toBe("HDML-TABLE");
    expect(table.outerHTML).toBe("<hdml-table></hdml-table>");
    expect(table.id).toBeUndefined();
    expect(table.limit).toBeUndefined();
    expect(root).not.toBeNull();
    expect(root.innerHTML).toEqual("<!----><slot></slot>");
  });

  test("set 'id' attribute", () => {
    table.setAttribute("id", "a");
    expect(table.id).toBe("a");
    expect(table.outerHTML).toBe('<hdml-table id="a"></hdml-table>');
  });

  test("set 'id' property", async () => {
    table.id = "b";
    await table.updateComplete;
    expect(table.getAttribute("id")).toBe("b");
    expect(table.outerHTML).toBe('<hdml-table id="b"></hdml-table>');
  });

  test("set 'limit' attribute", () => {
    table.setAttribute("limit", "1000");
    expect(table.limit).toBe(1000);
    expect(table.outerHTML).toBe(
      '<hdml-table limit="1000"></hdml-table>',
    );
  });

  test("set 'limit' property", async () => {
    table.limit = 1000;
    await table.updateComplete;
    expect(table.getAttribute("limit")).toBe("1000");
    expect(table.outerHTML).toBe(
      '<hdml-table limit="1000"></hdml-table>',
    );
  });
});

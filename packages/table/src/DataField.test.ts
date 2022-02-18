/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 * @fileoverview DataField component test suite.
 */

import DataField from "./DataField";

describe("DataField component", () => {
  describe("export", () => {
    it("DataField class should be default exported", () => {
      expect(DataField).toBeDefined();
    });
  });

  describe("<data-field>", () => {
    const ELEMENT_NODE = 1;
    let field: DataField;
    let root: ShadowRoot;
    customElements.define("data-field", DataField);

    beforeEach(() => {
      field = new DataField();
      document.body.appendChild(field);
    });

    afterEach(() => {
      field.remove();
    });

    test("DOM tree structure", () => {
      expect(field.nodeType).toBe(ELEMENT_NODE);
      expect(field.tagName).toBe("DATA-FIELD");
      expect(field.outerHTML).toBe("<data-field></data-field>");
    });

    test("Shadow DOM tree structure", () => {
      root = field.shadowRoot as ShadowRoot;
      expect(root).not.toBeNull();
      expect(root.innerHTML).toEqual("<!---->");
    });

    test("nullable attribute", () => {
      expect(field.nullable).toBeFalsy();
      field.nullable = true;
      expect(field.outerHTML).toBe('<data-field nullable="true"></data-field>');
    });
  });
});

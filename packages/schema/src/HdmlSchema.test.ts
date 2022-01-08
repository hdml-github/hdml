/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * @fileoverview Package's export test suite definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import hdmlSchema from "./HdmlSchema";

describe("<ampl-schema>", () => {
  const ELEMENT_NODE = 1;
  let schema: hdmlSchema;
  let root: ShadowRoot;

  beforeEach(() => {
    schema = new hdmlSchema();
    document.body.appendChild(schema);
  });

  afterEach(() => {
    schema.remove();
  });

  test("html structure", () => {
    root = schema.shadowRoot as ShadowRoot;
    expect(schema.nodeType).toBe(ELEMENT_NODE);
    expect(schema.tagName).toBe("hdml-SCHEMA");
    expect(schema.outerHTML).toBe("<hdml-schema></hdml-schema>");
    expect(root).not.toBeNull();
    expect(root.innerHTML).toEqual("<!----><slot></slot>");
  });
});

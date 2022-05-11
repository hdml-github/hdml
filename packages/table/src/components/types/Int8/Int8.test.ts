/**
 * @fileoverview Int8 component tests.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { expect as expect_def } from "@esm-bundle/chai";
import Int8 from "./Int8";

const expect = expect_def as (
  val: unknown,
  msg?: string,
) => Chai.Assertion;
const ELEMENT_NODE = 1;
const uid = new RegExp(
  "^([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]" +
    "{3}-[0-9a-f]{12})|[0-9]+$",
);

describe("Int8 component", () => {
  before(async () => {
    await customElements.whenDefined("int-8");
  });

  describe("<int-8/>", () => {
    let elm: Int8;

    beforeEach(() => {
      window.document.body.innerHTML = `<int-8/>`;
      elm = document.querySelector("int-8");
    });

    it("default values", () => {
      expect(elm.nodeType, "node type").to.equal(ELEMENT_NODE);
      expect(elm.tagName, "tag name").to.equal("INT-8");
      expect(elm.outerHTML, "outer html").to.equal("<int-8></int-8>");
      expect(elm.uid, "uid property defined").not.to.be.undefined;
      expect(uid.test(elm.uid), "uid property regexp").to.be.true;
      expect(elm.name, "name property").to.eq("");
    });
  });
});

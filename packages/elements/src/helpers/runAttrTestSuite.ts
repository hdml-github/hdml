/**
 * @fileoverview Element's attribute/property test suite.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { expect } from "@esm-bundle/chai";
import { createSandbox } from "sinon";
import { UnifiedElement } from "../components/UnifiedElement";

type Tested = {
  [key: string]: unknown;
  getAttribute: (attr: string) => unknown;
  setAttribute: (attr: string, val: unknown) => void;
  removeAttribute: (attr: string) => void;
  remove: () => void;
};

export function runAttrTestSuite(
  Constructor: new () => UnifiedElement,
  property: { name: string; valid: unknown; invalid: unknown },
  attribute: { name: string; valid: unknown; invalid: unknown },
): void {
  describe("instantiated in script", () => {
    const sandbox = createSandbox();

    beforeEach(() => {
      sandbox.spy(console, "error");
    });

    afterEach(() => {
      sandbox.restore();
    });

    it(`must contain a nulled \`${property.name}\` property`, () => {
      const element: Tested = <Tested>(<unknown>new Constructor());
      window.document.body.appendChild(<Node>(<unknown>element));

      expect(
        element[property.name],
        `\`${property.name}\` property is undefined`,
      ).not.to.be.undefined;

      expect(
        element[property.name],
        `\`${property.name}\` property value is not null`,
      ).to.equal(null);

      expect(
        element.getAttribute(attribute.name),
        `\`${attribute.name}\` attribute is undefined`,
      ).not.to.be.undefined;

      expect(
        element.getAttribute(attribute.name),
        `\`${property.name}\` attribute value is not null`,
      ).to.equal(null);
    });

    it(
      `must ignore an invalid \`${property.name}\` ` +
        "property values",
      () => {
        const element: Tested = <Tested>(<unknown>new Constructor());
        window.document.body.appendChild(<Node>(<unknown>element));
        element[property.name] = property.invalid;

        expect(
          element[property.name],
          `\`${property.name}\` property is undefined`,
        ).not.to.be.undefined;

        expect(
          element[property.name],
          `\`${property.name}\` property is not null`,
        ).to.equal(null);

        expect(
          element.getAttribute(attribute.name),
          `\`${attribute.name}\` attribute is undefined`,
        ).not.to.be.undefined;

        expect(
          element.getAttribute(attribute.name),
          `\`${property.name}\` attribute value is not null`,
        ).to.equal(null);

        // @ts-ignore
        expect(console.error.calledOnce, "error consoled not once").to
          .be.true;

        expect(
          // @ts-ignore
          console.error.getCall(0).args[0],
          "error message",
        ).to.equal(
          `The \`${property.name}\` property value ` +
            `"${property.invalid}" doesn't ` +
            "match an element schema. Skipped.",
        );
      },
    );

    it(
      `must keep a valid \`${property.name}\` property ` +
        "value if invalid was set after a valid",
      async () => {
        const element: Tested = <Tested>(<unknown>new Constructor());
        window.document.body.appendChild(<Node>(<unknown>element));
        element[property.name] = property.valid;
        await element.updateComplete;
        element[property.name] = property.invalid;

        expect(
          element[property.name],
          `\`${property.name}\` property is undefined`,
        ).not.to.be.undefined;

        expect(
          element[property.name],
          `\`${property.name}\` property is not valid`,
        ).to.equal(property.valid);

        expect(
          element.getAttribute(attribute.name),
          `\`${attribute.name}\` attribute is undefined`,
        ).not.to.be.undefined;

        expect(
          element.getAttribute(attribute.name),
          `\`${attribute.name}\` attribute value is not valid`,
        ).to.equal(attribute.valid);

        // @ts-ignore
        expect(console.error.calledOnce, "error consoled not once").to
          .be.true;

        expect(
          // @ts-ignore
          console.error.getCall(0).args[0],
          "error message",
        ).to.equal(
          `The \`${property.name}\` property value ` +
            `"${property.invalid}" doesn't ` +
            "match an element schema. Skipped.",
        );
      },
    );

    it(
      `must set a correct \`${property.name}\` ` + "property values",
      async () => {
        const element: Tested = <Tested>(<unknown>new Constructor());
        window.document.body.appendChild(<Node>(<unknown>element));
        element[property.name] = property.valid;
        await element.updateComplete;

        expect(
          element[property.name],
          `\`${property.name}\` property is undefined`,
        ).not.to.be.undefined;

        expect(
          element[property.name],
          `\`${property.name}\` property is not set`,
        ).to.equal(property.valid);

        expect(
          element.getAttribute(attribute.name),
          `\`${attribute.name}\` attribute is undefined`,
        ).not.to.be.undefined;

        expect(
          element.getAttribute(attribute.name),
          `\`${attribute.name}\` attribute value is not valid`,
        ).to.equal(attribute.valid);
      },
    );
  });

  describe("instantiated in HTML", () => {
    const sandbox = createSandbox();

    beforeEach(() => {
      sandbox.spy(console, "error");
    });

    afterEach(() => {
      sandbox.restore();
    });

    it(
      `must contain a nulled \`${property.name}\` property ` +
        `and a nulled \`${attribute.name}\` attribute`,
      () => {
        window.document.body.innerHTML = `<tested-element/>`;
        const element = <Tested>(
          (<unknown>document.querySelector("tested-element"))
        );
        const attr = element.getAttribute(attribute.name);

        expect(
          element[property.name],
          `\`${property.name}\` property is undefined`,
        ).not.to.be.undefined;

        expect(
          element[property.name],
          `\`${property.name}\` property is not null`,
        ).to.equal(null);

        expect(attr, `\`${attribute.name}\` attribute is undefined`)
          .not.to.be.undefined;

        expect(
          attr,
          `\`${attribute.name}\` attribute is not null`,
        ).to.equal(null);

        element.remove();
      },
    );

    it(
      `must contain an empty \`${property.name}\` property ` +
        `and an empty \`${attribute.name}\` attribute`,
      () => {
        window.document.body.innerHTML =
          "<tested-element " + `${attribute.name}/>`;
        const element = <Tested>(
          (<unknown>document.querySelector("tested-element"))
        );
        const attr = element.getAttribute(attribute.name);

        expect(
          element[property.name],
          `\`${property.name}\` property is undefined`,
        ).not.to.be.undefined;

        expect(
          element[property.name],
          `\`${property.name}\` property is not empty`,
        ).to.equal("");

        expect(attr, `\`${attribute.name}\` attribute is undefined`)
          .not.to.be.undefined;

        expect(
          attr,
          `\`${attribute.name}\` attribute is not empty`,
        ).to.equal("");

        element.remove();
      },
    );

    it(
      `must ignore an incorrect \`${property.name}\` ` +
        "property values",
      async () => {
        window.document.body.innerHTML = `<tested-element/>`;
        const element = <Tested>(
          (<unknown>document.querySelector("tested-element"))
        );
        element[property.name] = property.invalid;
        await element.updateComplete;
        const attr = element.getAttribute(attribute.name);

        expect(
          element[property.name],
          `\`${property.name}\` property is undefined`,
        ).not.to.be.undefined;

        expect(
          element[property.name],
          `\`${property.name}\` property is not null`,
        ).to.equal(null);

        expect(attr, `\`${attribute.name}\` attribute is undefined`)
          .not.to.be.undefined;

        expect(
          attr,
          `\`${attribute.name}\` attribute is not null`,
        ).to.equal(null);

        // @ts-ignore
        expect(console.error.calledOnce, "error consoled not once").to
          .be.true;

        expect(
          // @ts-ignore
          console.error.getCall(0).args[0],
          "error message",
        ).to.equal(
          `The \`${property.name}\` property value ` +
            `"${property.invalid}" doesn't match ` +
            "an element schema. Skipped.",
        );
      },
    );

    it(
      `must keep a correct \`${property.name}\` property value ` +
        `and a correct \`${attribute.name}\` attribute value` +
        "if incorrect property was set",
      async () => {
        window.document.body.innerHTML = `<tested-element/>`;
        const element = <Tested>(
          (<unknown>document.querySelector("tested-element"))
        );
        element[property.name] = property.valid;
        await element.updateComplete;
        element[property.name] = property.invalid;
        const attr = element.getAttribute(attribute.name);

        expect(
          element[property.name],
          `\`${property.name}\` property is undefined`,
        ).not.to.be.undefined;

        expect(
          element[property.name],
          `\`${property.name}\` property is not valid`,
        ).to.equal(property.valid);

        expect(attr, `\`${attribute.name}\` attribute is undefined`)
          .not.to.be.undefined;

        expect(
          attr,
          `\`${attribute.name}\` attribute is not valid`,
        ).to.equal(attribute.valid);

        // @ts-ignore
        expect(console.error.calledOnce, "error consoled not once").to
          .be.true;

        expect(
          // @ts-ignore
          console.error.getCall(0).args[0],
          "error message",
        ).to.equal(
          `The \`${property.name}\` property value ` +
            `"${property.invalid}" doesn't match ` +
            "an element schema. Skipped.",
        );
      },
    );

    it(
      `must ignore an incorrect \`${attribute.name}\` ` +
        "attribute values",
      () => {
        window.document.body.innerHTML =
          `<tested-element ` +
          `${attribute.name}=` +
          `"${attribute.invalid}"/>`;
        const element = <Tested>(
          (<unknown>document.querySelector("tested-element"))
        );
        const attr = element.getAttribute(attribute.name);

        expect(
          element[property.name],
          `\`${property.name}\` property is undefined`,
        ).not.to.be.undefined;

        expect(
          element[property.name],
          `\`${property.name}\` property is not null`,
        ).to.equal(null);

        expect(attr, `\`${attribute.name}\` attribute is undefined`)
          .not.to.be.undefined;

        expect(
          attr,
          `\`${attribute.name}\` attribute is not null`,
        ).to.equal(null);

        // @ts-ignore
        expect(console.error.calledOnce, "error consoled not once").to
          .be.true;

        expect(
          // @ts-ignore
          console.error.getCall(0).args[0],
          "error message",
        ).to.equal(
          `The \`${property.name}\` property value ` +
            `"${attribute.invalid}" doesn't match ` +
            "an element schema. Skipped.",
        );
      },
    );

    it(
      `must keep a correct \`${property.name}\` property value ` +
        `and a correct \`${attribute.name}\` attribute value` +
        "if incorrect attribute was set",
      () => {
        window.document.body.innerHTML =
          `<tested-element ` +
          `${attribute.name}=` +
          `"${attribute.valid}"/>`;
        const element = <Tested>(
          (<unknown>document.querySelector("tested-element"))
        );
        element.setAttribute(attribute.name, attribute.invalid);
        const attr = element.getAttribute(attribute.name);

        expect(
          element[property.name],
          `\`${property.name}\` property is undefined`,
        ).not.to.be.undefined;

        expect(
          element[property.name],
          `\`${property.name}\` property is not valid`,
        ).to.equal(property.valid);

        expect(attr, `\`${attribute.name}\` attribute is undefined`)
          .not.to.be.undefined;

        expect(
          attr,
          `\`${attribute.name}\` attribute is not valid`,
        ).to.equal(attribute.valid);

        // @ts-ignore
        expect(console.error.calledOnce, "error consoled not once").to
          .be.true;

        expect(
          // @ts-ignore
          console.error.getCall(0).args[0],
          "error message",
        ).to.equal(
          `The \`${property.name}\` property value ` +
            `"${attribute.invalid}" doesn't match ` +
            "an element schema. Skipped.",
        );
      },
    );

    it(
      `must set a correct \`${property.name}\` ` + "property value",
      async () => {
        window.document.body.innerHTML = `<tested-element/>`;
        const element = <Tested>(
          (<unknown>document.querySelector("tested-element"))
        );
        element[property.name] = property.valid;
        await element.updateComplete;
        const attr = element.getAttribute(attribute.name);

        expect(
          element[property.name],
          `\`${property.name}\` property is undefined`,
        ).not.to.be.undefined;

        expect(
          element[property.name],
          `\`${property.name}\` property is not set`,
        ).to.equal(property.valid);

        expect(attr, `\`${attribute.name}\` attribute is undefined`)
          .not.to.be.undefined;

        expect(
          attr,
          `\`${attribute.name}\` attribute is not set`,
        ).to.equal(attribute.valid);
      },
    );

    it(
      `must set a correct \`${attribute.name}\` ` + "attribute value",
      () => {
        window.document.body.innerHTML =
          `<tested-element ${attribute.name}=` +
          `"${attribute.valid}"/>`;
        const element = <Tested>(
          (<unknown>document.querySelector("tested-element"))
        );
        const attr = element.getAttribute(attribute.name);

        expect(
          element[property.name],
          `\`${property.name}\` property is undefined`,
        ).not.to.be.undefined;

        expect(
          element[property.name],
          `\`${property.name}\` property is not set`,
        ).to.equal(property.valid);

        expect(attr, `\`${attribute.name}\` attribute is undefined`)
          .not.to.be.undefined;

        expect(
          attr,
          `\`${attribute.name}\` attribute is not set`,
        ).to.equal(attribute.valid);
      },
    );

    it(
      `must set the \`${attribute.name}\` attribute to "" ` +
        `and the \`${property.name}\` property to "" ` +
        "if empty property was set",
      async () => {
        window.document.body.innerHTML =
          `<tested-element ${attribute.name}=` +
          `"${attribute.valid}"/>`;
        const element = <Tested>(
          (<unknown>document.querySelector("tested-element"))
        );
        element[property.name] = "";
        await element.updateComplete;
        const attr = element.getAttribute(attribute.name);

        expect(
          element[property.name],
          `\`${property.name}\` property is undefined`,
        ).not.to.be.undefined;

        expect(
          element[property.name],
          `\`${property.name}\` property is not empty`,
        ).to.equal("");

        expect(attr, `\`${attribute.name}\` attribute is undefined`)
          .not.to.be.undefined;

        expect(
          attr,
          `\`${attribute.name}\` attribute is not empty`,
        ).to.equal("");
      },
    );

    it(
      `must set the \`${attribute.name}\` attribute to null ` +
        `and the \`${property.name}\` property to null ` +
        "if null property was set",
      async () => {
        window.document.body.innerHTML =
          `<tested-element ${attribute.name}=` +
          `"${attribute.valid}"/>`;
        const element = <Tested>(
          (<unknown>document.querySelector("tested-element"))
        );
        element[property.name] = null;
        await element.updateComplete;
        const attr = element.getAttribute(attribute.name);

        expect(
          element[property.name],
          `\`${property.name}\` property is undefined`,
        ).not.to.be.undefined;

        expect(
          element[property.name],
          `\`${property.name}\` property is not empty`,
        ).to.equal(null);

        expect(attr, `\`${attribute.name}\` attribute is undefined`)
          .not.to.be.undefined;

        expect(
          attr,
          `\`${attribute.name}\` attribute is not empty`,
        ).to.equal(null);
      },
    );

    it(
      `must set the \`${attribute.name}\` attribute to "" ` +
        `and the \`${property.name}\` property to "" ` +
        "if empty attribute was set",
      () => {
        window.document.body.innerHTML =
          `<tested-element ${attribute.name}=` +
          `"${attribute.valid}"/>`;
        const element = <Tested>(
          (<unknown>document.querySelector("tested-element"))
        );
        element.setAttribute(attribute.name, "");
        const attr = element.getAttribute(attribute.name);

        expect(
          element[property.name],
          `\`${property.name}\` property is undefined`,
        ).not.to.be.undefined;

        expect(
          element[property.name],
          `\`${property.name}\` property is not empty`,
        ).to.equal("");

        expect(attr, `\`${attribute.name}\` attribute is undefined`)
          .not.to.be.undefined;

        expect(
          attr,
          `\`${attribute.name}\` attribute is not empty`,
        ).to.equal("");
      },
    );

    it(
      `must set the \`${attribute.name}\` attribute to null ` +
        `and the \`${property.name}\` property to null ` +
        "if null attribute was set",
      () => {
        window.document.body.innerHTML =
          `<tested-element ${attribute.name}=` +
          `"${attribute.valid}"/>`;
        const element = <Tested>(
          (<unknown>document.querySelector("tested-element"))
        );
        element.removeAttribute(attribute.name);
        const attr = element.getAttribute(attribute.name);

        expect(
          element[property.name],
          `\`${property.name}\` property is undefined`,
        ).not.to.be.undefined;

        expect(
          element[property.name],
          `\`${property.name}\` property is not null`,
        ).to.equal(null);

        expect(attr, `\`${attribute.name}\` attribute is undefined`)
          .not.to.be.undefined;

        expect(
          attr,
          `\`${attribute.name}\` attribute is not null`,
        ).to.equal(null);
      },
    );
  });
}

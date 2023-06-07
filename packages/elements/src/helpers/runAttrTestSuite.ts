/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

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
    // const sandbox = createSandbox();

    // beforeEach(() => {
    //   sandbox.spy(console, "error");
    // });

    // afterEach(() => {
    //   sandbox.restore();
    // });

    it(`must contain a nulled \`${property.name}\` property`, () => {
      const element: Tested = <Tested>(<unknown>new Constructor());
      window.document.body.appendChild(<Node>(<unknown>element));

      expect(element[property.name]).not.toBeUndefined();

      expect(element[property.name]).toBeNull();

      expect(
        element.getAttribute(attribute.name),
      ).not.toBeUndefined();

      expect(element.getAttribute(attribute.name)).toBeNull();
    });

    it(
      `must ignore an invalid \`${property.name}\` ` +
        "property values",
      () => {
        const element: Tested = <Tested>(<unknown>new Constructor());
        window.document.body.appendChild(<Node>(<unknown>element));
        element[property.name] = property.invalid;

        expect(element[property.name]).not.toBeUndefined();

        expect(element[property.name]).toBeNull();

        expect(
          element.getAttribute(attribute.name),
        ).not.toBeUndefined();

        expect(element.getAttribute(attribute.name)).toBeNull();

        // expect(
        //   console.error.calledOnce,
        //   "error consoled not once",
        // ).toBeTruthy();

        // expect(console.error.getCall(0).args[0]).toEqual(
        //   `The \`${property.name}\` property value ` +
        //     `"${property.invalid}" doesn't ` +
        //     "match an element schema. Skipped.",
        // );
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

        expect(element[property.name]).not.toBeUndefined();

        expect(element[property.name]).toEqual(property.valid);

        expect(
          element.getAttribute(attribute.name),
        ).not.toBeUndefined();

        expect(element.getAttribute(attribute.name)).toEqual(
          attribute.valid,
        );

        // expect(
        //   console.error.calledOnce,
        //   "error consoled not once",
        // ).toBeTruthy();

        // expect(
        //   console.error.getCall(0).args[0],
        // ).toEqual(
        //   `The \`${property.name}\` property value ` +
        //     `"${property.invalid}" doesn't ` +
        //     "match an element schema. Skipped.",
        // );
      },
    );

    it(
      `must set a correct \`${property.name}\` ` + "property values",
      async () => {
        const element: Tested = <Tested>(<unknown>new Constructor());
        window.document.body.appendChild(<Node>(<unknown>element));
        element[property.name] = property.valid;
        await element.updateComplete;

        expect(element[property.name]).not.toBeUndefined();

        expect(element[property.name]).toEqual(property.valid);

        expect(
          element.getAttribute(attribute.name),
        ).not.toBeUndefined();

        expect(element.getAttribute(attribute.name)).toEqual(
          attribute.valid,
        );
      },
    );
  });

  describe("instantiated in HTML", () => {
    // const sandbox = createSandbox();

    // beforeEach(() => {
    //   sandbox.spy(console, "error");
    // });

    // afterEach(() => {
    //   sandbox.restore();
    // });

    it(
      `must contain a nulled \`${property.name}\` property ` +
        `and a nulled \`${attribute.name}\` attribute`,
      () => {
        window.document.body.innerHTML = `<tested-element/>`;
        const element = <Tested>(
          (<unknown>document.querySelector("tested-element"))
        );
        const attr = element.getAttribute(attribute.name);

        expect(element[property.name]).not.toBeUndefined();

        expect(element[property.name]).toBeNull();

        expect(attr).not.toBeUndefined();

        expect(attr).toBeNull();

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

        expect(element[property.name]).not.toBeUndefined();

        expect(element[property.name]).toEqual("");

        expect(attr).not.toBeUndefined();

        expect(attr).toEqual("");

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

        expect(element[property.name]).not.toBeUndefined();

        expect(element[property.name]).toBeNull();

        expect(attr).not.toBeUndefined();

        expect(attr).toBeNull();

        // expect(
        //   console.error.calledOnce,
        //   "error consoled not once",
        // ).toBeTruthy();

        // expect(
        //   // @ts-ignore
        //   console.error.getCall(0).args[0],
        // ).toEqual(
        //   `The \`${property.name}\` property value ` +
        //     `"${property.invalid}" doesn't match ` +
        //     "an element schema. Skipped.",
        // );
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

        expect(element[property.name]).not.toBeUndefined();

        expect(element[property.name]).toEqual(property.valid);

        expect(attr).not.toBeUndefined();

        expect(attr).toEqual(attribute.valid);

        // expect(
        //   console.error.calledOnce,
        //   "error consoled not once",
        // ).toBeTruthy();

        // expect(
        //   console.error.getCall(0).args[0],
        // ).toEqual(
        //   `The \`${property.name}\` property value ` +
        //     `"${property.invalid}" doesn't match ` +
        //     "an element schema. Skipped.",
        // );
      },
    );

    it(
      `must ignore an incorrect \`${attribute.name}\` ` +
        "attribute values",
      () => {
        window.document.body.innerHTML =
          `<tested-element ` +
          `${attribute.name}=` +
          `"${JSON.stringify(attribute.invalid)}"/>`;
        const element = <Tested>(
          (<unknown>document.querySelector("tested-element"))
        );
        const attr = element.getAttribute(attribute.name);

        expect(element[property.name]).not.toBeUndefined();

        expect(element[property.name]).toBeNull();

        expect(attr).not.toBeUndefined();

        expect(attr).toBeNull();

        // expect(
        //   console.error.calledOnce,
        //   "error consoled not once",
        // ).toBeTruthy();

        // expect(
        //   console.error.getCall(0).args[0],
        // ).toEqual(
        //   `The \`${property.name}\` property value ` +
        //     `"${attribute.invalid}" doesn't match ` +
        //     "an element schema. Skipped.",
        // );
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
          `"${JSON.stringify(attribute.valid)}"/>`;
        const element = <Tested>(
          (<unknown>document.querySelector("tested-element"))
        );
        element.setAttribute(attribute.name, attribute.invalid);
        const attr = element.getAttribute(attribute.name);

        expect(element[property.name]).not.toBeUndefined();

        expect(element[property.name]).toEqual(property.valid);

        expect(attr).not.toBeUndefined();

        expect(attr).toEqual(attribute.valid);

        // expect(console.error.calledOnce).toBeTruthy();

        // expect(
        //   console.error.getCall(0).args[0],
        // ).toEqual(
        //   `The \`${property.name}\` property value ` +
        //     `"${attribute.invalid}" doesn't match ` +
        //     "an element schema. Skipped.",
        // );
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

        expect(element[property.name]).not.toBeUndefined();

        expect(element[property.name]).toEqual(property.valid);

        expect(attr).not.toBeUndefined();

        expect(attr).toEqual(attribute.valid);
      },
    );

    it(
      `must set a correct \`${attribute.name}\` ` + "attribute value",
      () => {
        window.document.body.innerHTML =
          `<tested-element ${attribute.name}=` +
          `"${JSON.stringify(attribute.valid)}"/>`;
        const element = <Tested>(
          (<unknown>document.querySelector("tested-element"))
        );
        const attr = element.getAttribute(attribute.name);

        expect(element[property.name]).not.toBeUndefined();

        expect(element[property.name]).toEqual(property.valid);

        expect(attr).not.toBeUndefined();

        expect(attr).toEqual(attribute.valid);
      },
    );

    it(
      `must set the \`${attribute.name}\` attribute to "" ` +
        `and the \`${property.name}\` property to "" ` +
        "if empty property was set",
      async () => {
        window.document.body.innerHTML =
          `<tested-element ${attribute.name}=` +
          `"${JSON.stringify(attribute.valid)}"/>`;
        const element = <Tested>(
          (<unknown>document.querySelector("tested-element"))
        );
        element[property.name] = "";
        await element.updateComplete;
        const attr = element.getAttribute(attribute.name);

        expect(element[property.name]).not.toBeUndefined();

        expect(element[property.name]).toEqual("");

        expect(attr).not.toBeUndefined();

        expect(attr).toEqual("");
      },
    );

    it(
      `must set the \`${attribute.name}\` attribute to null ` +
        `and the \`${property.name}\` property to null ` +
        "if null property was set",
      async () => {
        window.document.body.innerHTML =
          `<tested-element ${attribute.name}=` +
          `"${JSON.stringify(attribute.valid)}"/>`;
        const element = <Tested>(
          (<unknown>document.querySelector("tested-element"))
        );
        element[property.name] = null;
        await element.updateComplete;
        const attr = element.getAttribute(attribute.name);

        expect(element[property.name]).not.toBeUndefined();

        expect(element[property.name]).toBeNull();

        expect(attr).not.toBeUndefined();

        expect(attr).toBeNull();
      },
    );

    it(
      `must set the \`${attribute.name}\` attribute to "" ` +
        `and the \`${property.name}\` property to "" ` +
        "if empty attribute was set",
      () => {
        window.document.body.innerHTML =
          `<tested-element ${attribute.name}=` +
          `"${JSON.stringify(attribute.valid)}"/>`;
        const element = <Tested>(
          (<unknown>document.querySelector("tested-element"))
        );
        element.setAttribute(attribute.name, "");
        const attr = element.getAttribute(attribute.name);

        expect(element[property.name]).not.toBeUndefined();

        expect(element[property.name]).toEqual("");

        expect(attr).not.toBeUndefined();

        expect(attr).toEqual("");
      },
    );

    it(
      `must set the \`${attribute.name}\` attribute to null ` +
        `and the \`${property.name}\` property to null ` +
        "if null attribute was set",
      () => {
        window.document.body.innerHTML =
          `<tested-element ${attribute.name}=` +
          `"${JSON.stringify(attribute.valid)}"/>`;
        const element = <Tested>(
          (<unknown>document.querySelector("tested-element"))
        );
        element.removeAttribute(attribute.name);
        const attr = element.getAttribute(attribute.name);

        expect(element[property.name]).not.toBeUndefined();

        expect(element[property.name]).toBeNull();

        expect(attr).not.toBeUndefined();

        expect(attr).toBeNull();
      },
    );
  });
}

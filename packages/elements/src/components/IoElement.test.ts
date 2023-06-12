import { runAttrTestSuite } from "../helpers/runAttrTestSuite";
import { IoElement } from "./IoElement";

// runTests(() => {
describe("IoElement", () => {
  before(async () => {
    customElements.define("tested-element", IoElement);
    await customElements.whenDefined("tested-element");
  });

  // name
  runAttrTestSuite(
    IoElement,
    // property
    { name: "name", valid: "hdml.io", invalid: "*/#$" },
    // attribute
    { name: "name", valid: "hdml.io", invalid: "*/#$" },
  );
  runAttrTestSuite(
    IoElement,
    { name: "name", valid: "s.hdml.io", invalid: "1.hdml.io" },
    { name: "name", valid: "s.hdml.io", invalid: "1.hdml.io" },
  );
  runAttrTestSuite(
    IoElement,
    { name: "name", valid: "s.hdml.io", invalid: "a.hdml.io1" },
    { name: "name", valid: "s.hdml.io", invalid: "a.hdml.io1" },
  );
  runAttrTestSuite(
    IoElement,
    {
      name: "name",
      valid: "s.h-d_m-l.io",
      invalid: "a.hdml.ioioioio",
    },
    {
      name: "name",
      valid: "s.h-d_m-l.io",
      invalid: "a.hdml.ioioioio",
    },
  );

  // tenant
  runAttrTestSuite(
    IoElement,
    { name: "tenant", valid: "tenant_1", invalid: "1_tenant" },
    { name: "tenant", valid: "tenant_1", invalid: "1_tenant" },
  );
  runAttrTestSuite(
    IoElement,
    { name: "tenant", valid: "tenant-1", invalid: "tenant 1" },
    { name: "tenant", valid: "tenant-1", invalid: "tenant 1" },
  );
  runAttrTestSuite(
    IoElement,
    { name: "tenant", valid: "tenant-1_0", invalid: "_tenant-1" },
    { name: "tenant", valid: "tenant-1_0", invalid: "_tenant-1" },
  );

  // token
  runAttrTestSuite(
    IoElement,
    { name: "token", valid: "token./=+-1", invalid: "token 1" },
    { name: "token", valid: "token./=+-1", invalid: "token\\" },
  );
});
// }).catch;

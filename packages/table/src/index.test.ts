/**
 * @fileoverview Package's export test suite definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  afterAll,
  beforeAll,
  afterEach,
  beforeEach,
  expect,
  jest,
  test,
} from "@jest/globals";
import * as regular_import from "./index";

describe("Package's export test suite", () => {
  test("export object is defined", () => {
    expect(regular_import).toBeDefined();
  });
});

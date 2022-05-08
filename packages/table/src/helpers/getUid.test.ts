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
import getUid from "./getUid";

const str =
  "^([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab]" +
  "[0-9a-f]{3}-[0-9a-f]{12})|[0-9]+$";
const re = new RegExp(str);

describe("helpers/getUid", () => {
  test("getUid is defined and a function", () => {
    expect(getUid).toBeDefined();
    expect(typeof getUid).toEqual("function");
  });
  test("getUid() returns unique value", () => {
    const val1 = getUid();
    const val2 = getUid();
    expect(val1).toBeDefined();
    expect(typeof val1).toEqual("string");
    expect(re.test(val1)).toBeTruthy();
    expect(val2).toBeDefined();
    expect(typeof val2).toEqual("string");
    expect(re.test(val2)).toBeTruthy();
    expect(val1 !== val2).toBeTruthy();
  });
  test("getUid('string') returns unique for the string value", () => {
    const val1 = getUid("string1");
    const val2 = getUid("string1");
    const val3 = getUid("string2");
    expect(val1).toBeDefined();
    expect(typeof val1).toEqual("string");
    expect(re.test(val1)).toBeTruthy();
    expect(val2).toBeDefined();
    expect(typeof val2).toEqual("string");
    expect(re.test(val2)).toBeTruthy();
    expect(val3).toBeDefined();
    expect(typeof val3).toEqual("string");
    expect(re.test(val3)).toBeTruthy();
    expect(val1 === val2).toBeTruthy();
    expect(val1 !== val3).toBeTruthy();
  });
});

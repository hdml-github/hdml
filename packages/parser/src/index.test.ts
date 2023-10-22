/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { parse } from ".";

describe("`@hdml/parser` package", () => {
  it("must export `parse` function", () => {
    expect(parse).toBeDefined();
  });
});

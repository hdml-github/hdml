/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { perspective, arrow } from ".";

describe("`@hdml/com.database` package", () => {
  it("must export `perspective` library", () => {
    expect(perspective).toBeDefined();
  });

  it("must export `arrow` library", () => {
    expect(arrow).toBeDefined();
  });
});

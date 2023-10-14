/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { program, Option } from "commander";

/**
 * CLI options.
 */
type CliOpts = {
  /**
   * Service mode.
   */
  mode: "gateway" | "hideway" | "querier";

  /**
   * Path to the `.env` file.
   */
  envpath: string;
};

// CLI configuration.
program.addOption(
  new Option("--mode <mode>")
    .choices(["gateway", "hideway", "querier"])
    .makeOptionMandatory(),
);
program.option("--envpath <envpath>");
program.parse();

/**
 * Returns CLI options object.
 */
export function getCliOpts(): CliOpts {
  return program.opts<CliOpts>();
}

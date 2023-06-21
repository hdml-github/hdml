/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { defineModel, defineDefaults } from "@hdml/elements";
import { ModelWidget } from "./components/ModelWidget";
(async () => {
  await defineModel("hdml-model", ModelWidget);
  await defineDefaults();
})().catch((error) => {
  console.error(error);
});

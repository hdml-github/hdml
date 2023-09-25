/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  defineModel,
  defineDefaults,
  defineTable,
} from "@hdml/elements";
import { ModelWidget } from "./components/ModelWidget";
import { TableWidget } from "./components/TableWidget";

(async () => {
  await defineModel("hdml-model", ModelWidget);
  await defineTable("hdml-table", TableWidget);
  await defineDefaults();
})().catch((error) => {
  console.error(error);
});

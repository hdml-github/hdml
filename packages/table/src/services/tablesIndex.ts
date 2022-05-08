/**
 * @fileoverview Tables index service definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Errors } from "@hdml/messages";
import schemas, { HdmlTableSchema } from "../schemas/schemas";
import HdmlElement from "../components/HdmlElement";
import HdmlTable from "../components/HdmlTable";

type hdmlTableValidator = (val: HdmlTableSchema) => Promise<void>;

/**
 * HDML tables index map.
 */
const tables: Map<string, HdmlTableSchema> = new Map();

/**
 * HdmlTableSchema object validator.
 */
const validate: hdmlTableValidator = schemas.getSchema(
  "HDML-TABLE",
) as hdmlTableValidator;

/**
 * <hdml-table/> assert function.
 */
async function assert(table: HdmlTable): Promise<void> {
  if (tables.has(table.name)) {
    throw new Error(Errors.TABLE_EXIST);
  }
  await validate({
    uid: table.uid,
    name: table.name,
    limit: table.limit,
  });
}

/**
 * Adds specifird <hdml-table/> to the tables index.
 */
async function addTable(element: HdmlElement): Promise<void> {
  const table = element as HdmlTable;
  await assert(table);
  tables.set(table.name, {
    uid: table.uid,
    name: table.name,
    limit: table.limit,
  });
}

/**
 * Removes HDML element by specified uid.
 */
function removeTable(element: HdmlElement): void {
  const table = element as HdmlTable;
  tables.delete(table.name);
}

export default {
  tables,
  addTable,
  removeTable,
};

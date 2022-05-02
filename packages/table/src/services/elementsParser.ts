/**
 * @fileoverview TableService class definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Errors } from "@hdml/messages";
import schemas, { HdmlTableSchema } from "../schemas/schemas";
import HdmlElement from "../components/HdmlElement";
import HdmlTable from "../components/HdmlTable";

const _elements: Map<string, HdmlElement> = new Map();
const _tables: Map<string, HdmlTableSchema> = new Map();

/**
 * HDML elements parser service.
 */
class ElementsParser {
  private async _addTable(element: Element): Promise<void> {
    const el = element as HdmlTable;
    if (_tables.has(el.name)) {
      throw new Error(Errors.TABLE_EXIST);
    } else {
      const assert = schemas.getSchema("HDML-TABLE") as (
        val: HdmlTableSchema,
      ) => Promise<void>;
      await assert({
        uid: el.uid,
        name: el.name,
        limit: el.limit,
      });
      _tables.set(el.name, {
        uid: el.uid,
        name: el.name,
        limit: el.limit,
      });
    }
  }

  public async addElement(element: HdmlElement): Promise<void> {
    _elements.set(element.uid, element);
    switch (element.tagName) {
      case "HDML-TABLE":
        await this._addTable(element);
        break;
      default:
        break;
    }
  }

  public getElementByUid(uid: string): null | HdmlElement {
    if (_elements.has(uid)) {
      return _elements.get(uid) as HdmlElement;
    } else {
      return null;
    }
  }

  public removeElement(element: HdmlElement): void {
    _elements.delete(element.uid);
  }
}
export default new ElementsParser();

import { Type as ArrowType } from "@hdml/arrow";
import { html, TemplateResult, LitElement } from "lit";

/**
 * hdml-table data fields base class.
 */
class DataField extends LitElement {
  static properties = {
    /**
     * Nullable attribute definition.
     */
    nullable: {
      attribute: "nullable",
      type: Boolean,
      reflect: true,
      // converter: (): boolean => true,
    },
  };

  /**
   * Nullable data filed flag.
   */
  public nullable: boolean;

  /**
   * Class constructor.
   */
  constructor() {
    super();
    this.nullable = false;
  }
}
export default DataField;

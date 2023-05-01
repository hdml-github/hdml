/**
 * @fileoverview The `FieldElement` class types definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, TemplateResult } from "lit";
import {
  CommonOptsData,
  DecimalOptsData,
  DateOptsData,
  TimeOptsData,
  TimestampOptsData,
  TypeData,
  DataType,
  FieldData,
  DateUnit,
  TimeUnit,
  TimeZone,
  AggType,
} from "@hdml/schema";
import {
  FIELD_NAME_REGEXP,
  FIELD_ORIGIN_REGEXP,
  FIELD_CLAUSE_REGEXP,
  FIELD_TYPE_REGEXP,
  FIELD_NULLABLE_REGEXP,
  FIELD_SCALE_REGEXP,
  FIELD_PRECISION_REGEXP,
  FIELD_BIT_WIDTH_REGEXP,
  FIELD_DATE_UNIT_REGEXP,
  FIELD_TIME_UNIT_REGEXP,
  FIELD_TZ_REGEXP,
  FIELD_AGG_REGEXP,
  FIELD_ASC_REGEXP,
} from "../helpers/constants";
import {
  getTableTag,
  getFrameTag,
  getGroupByTag,
  getSortByTag,
} from "../helpers/elementsRegister";
import { UnifiedElement } from "./UnifiedElement";

/**
 * An `hdml-field` element event detail interface.
 */
export interface FieldEventDetail {
  field: FieldElement;
}

/**
 * The `FieldElement` class.
 */
export class FieldElement extends UnifiedElement {
  /**
   * Reactive attributes.
   */
  public static properties = {
    /**
     * A `name` property definition.
     */
    name: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `origin` property definition.
     */
    origin: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `clause` property definition.
     */
    clause: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `type` property definition.
     */
    type: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `nullable` property definition.
     */
    nullable: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `scale` property definition.
     */
    scale: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `precision` property definition.
     */
    precision: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `bitWidth` property definition.
     */
    bitWidth: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `unit` property definition.
     */
    unit: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `timezone` property definition.
     */
    timezone: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `agg` property definition.
     */
    agg: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },

    /**
     * A `asc` property definition.
     */
    asc: {
      type: String,
      attribute: true,
      reflect: true,
      noAccessor: true,
      state: false,
    },
  };

  /**
   * A `name` private property.
   */
  private _name: null | string = null;

  /**
   * A `origin` private property.
   */
  private _origin: null | string = null;

  /**
   * A `clause` private property.
   */
  private _clause: null | string = null;

  /**
   * A `type` private property.
   */
  private _type: null | string = null;

  /**
   * A `nullable` private property.
   */
  private _nullable: null | string = null;

  /**
   * A `scale` private property.
   */
  private _scale: null | string = null;

  /**
   * A `precision` private property.
   */
  private _precision: null | string = null;

  /**
   * A `bitWidth` private property.
   */
  private _bitWidth: null | string = null;

  /**
   * A `unit` private property.
   */
  private _unit: null | string = null;

  /**
   * A `timezone` private property.
   */
  private _timezone: null | string = null;

  /**
   * A `agg` private property.
   */
  private _agg: null | string = null;

  /**
   * A `asc` private property.
   */
  private _asc: null | string = null;

  /**
   * An assosiated `hdml-table`, `hdml-frame`, `hdml-group-by`,
   * `hdml-group-by` or `hdml-sort-by` element.
   */
  private _parent: null | Element = null;

  /**
   * A `name` setter.
   */
  public set name(val: null | string) {
    if (val === null || val === "" || FIELD_NAME_REGEXP.test(val)) {
      const old = this._name;
      this._name = val;
      this.requestUpdate("name", old);
    } else {
      console.error(
        `The \`name\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("name") === val) {
        if (this._name === null) {
          this.removeAttribute("name");
        } else {
          this.setAttribute("name", this._name);
        }
      }
    }
  }

  /**
   * A `name` getter.
   */
  public get name(): null | string {
    return this._name;
  }

  /**
   * A `origin` setter.
   */
  public set origin(val: null | string) {
    if (val === null || val === "" || FIELD_ORIGIN_REGEXP.test(val)) {
      const old = this._origin;
      this._origin = val;
      this.requestUpdate("origin", old);
    } else {
      console.error(
        `The \`origin\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("origin") === val) {
        if (this._origin === null) {
          this.removeAttribute("origin");
        } else {
          this.setAttribute("origin", this._origin);
        }
      }
    }
  }

  /**
   * A `origin` getter.
   */
  public get origin(): null | string {
    return this._origin;
  }

  /**
   * A `clause` setter.
   */
  public set clause(val: null | string) {
    if (val === null || val === "" || FIELD_CLAUSE_REGEXP.test(val)) {
      const old = this._clause;
      this._clause = val;
      this.requestUpdate("clause", old);
    } else {
      console.error(
        `The \`clause\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("clause") === val) {
        if (this._clause === null) {
          this.removeAttribute("clause");
        } else {
          this.setAttribute("clause", this._clause);
        }
      }
    }
  }

  /**
   * A `clause` getter.
   */
  public get clause(): null | string {
    return this._clause ? this._clause.replaceAll("`", '"') : null;
  }

  /**
   * A `type` setter.
   */
  public set type(val: null | string) {
    if (val === null || val === "" || FIELD_TYPE_REGEXP.test(val)) {
      const old = this._type;
      this._type = val;
      this.requestUpdate("type", old);
    } else {
      console.error(
        `The \`type\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("type") === val) {
        if (this._type === null) {
          this.removeAttribute("type");
        } else {
          this.setAttribute("type", this._type);
        }
      }
    }
  }

  /**
   * A `type` getter.
   */
  public get type(): null | string {
    return this._type;
  }

  /**
   * A `nullable` setter.
   */
  public set nullable(val: null | string) {
    if (
      val === null ||
      val === "" ||
      FIELD_NULLABLE_REGEXP.test(val)
    ) {
      const old = this._nullable;
      this._nullable = val;
      this.requestUpdate("nullable", old);
    } else {
      console.error(
        `The \`nullable\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("nullable") === val) {
        if (this._nullable === null) {
          this.removeAttribute("nullable");
        } else {
          this.setAttribute("nullable", this._nullable);
        }
      }
    }
  }

  /**
   * A `nullable` getter.
   */
  public get nullable(): null | string {
    return this._nullable;
  }

  /**
   * A `scale` setter.
   */
  public set scale(val: null | string) {
    if (val === null || val === "" || FIELD_SCALE_REGEXP.test(val)) {
      const old = this._scale;
      this._scale = val;
      this.requestUpdate("scale", old);
    } else {
      console.error(
        `The \`scale\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("scale") === val) {
        if (this._scale === null) {
          this.removeAttribute("scale");
        } else {
          this.setAttribute("scale", this._scale);
        }
      }
    }
  }

  /**
   * A `scale` getter.
   */
  public get scale(): null | string {
    return this._scale;
  }

  /**
   * A `precision` setter.
   */
  public set precision(val: null | string) {
    if (
      val === null ||
      val === "" ||
      FIELD_PRECISION_REGEXP.test(val)
    ) {
      const old = this._precision;
      this._precision = val;
      this.requestUpdate("precision", old);
    } else {
      console.error(
        `The \`precision\` property value "${val}" doesn't match ` +
          "an element RegExp.",
      );
      if (this.getAttribute("precision") === val) {
        if (this._precision === null) {
          this.removeAttribute("precision");
        } else {
          this.setAttribute("precision", this._precision);
        }
      }
    }
  }

  /**
   * A `precision` getter.
   */
  public get precision(): null | string {
    return this._precision;
  }

  /**
   * A `bitWidth` setter.
   */
  public set bitWidth(val: null | string) {
    if (
      val === null ||
      val === "" ||
      FIELD_BIT_WIDTH_REGEXP.test(val)
    ) {
      const old = this._scale;
      this._scale = val;
      this.requestUpdate("bitWidth", old);
    } else {
      console.error(
        `The \`bit-width\` property value "${val}" doesn't match ` +
          "an element RegExp.",
      );
      if (this.getAttribute("bit-width") === val) {
        if (this._bitWidth === null) {
          this.removeAttribute("bit-width");
        } else {
          this.setAttribute("bit-width", this._bitWidth);
        }
      }
    }
  }

  /**
   * A `bitWidth` getter.
   */
  public get bitWidth(): null | string {
    return this._bitWidth;
  }

  /**
   * A `unit` setter.
   */
  public set unit(val: null | string) {
    const RE =
      this.type === "date"
        ? FIELD_DATE_UNIT_REGEXP
        : FIELD_TIME_UNIT_REGEXP;
    if (val === null || val === "" || RE.test(val)) {
      const old = this._scale;
      this._scale = val;
      this.requestUpdate("unit", old);
    } else {
      console.error(
        `The \`unit\` property value "${val}" doesn't match ` +
          "an element RegExp.",
      );
      if (this.getAttribute("unit") === val) {
        if (this._unit === null) {
          this.removeAttribute("unit");
        } else {
          this.setAttribute("unit", this._unit);
        }
      }
    }
  }

  /**
   * A `unit` getter.
   */
  public get unit(): null | string {
    return this._unit;
  }

  /**
   * A `timezone` setter.
   */
  public set timezone(val: null | string) {
    if (val === null || val === "" || FIELD_TZ_REGEXP.test(val)) {
      const old = this._timezone;
      this._timezone = val;
      this.requestUpdate("timezone", old);
    } else {
      console.error(
        `The \`timezone\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("timezone") === val) {
        if (this._timezone === null) {
          this.removeAttribute("timezone");
        } else {
          this.setAttribute("timezone", this._timezone);
        }
      }
    }
  }

  /**
   * A `timezone` getter.
   */
  public get timezone(): null | string {
    return this._timezone;
  }

  /**
   * A `agg` setter.
   */
  public set agg(val: null | string) {
    if (val === null || val === "" || FIELD_AGG_REGEXP.test(val)) {
      const old = this._agg;
      this._agg = val;
      this.requestUpdate("agg", old);
    } else {
      console.error(
        `The \`agg\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("agg") === val) {
        if (this._agg === null) {
          this.removeAttribute("agg");
        } else {
          this.setAttribute("agg", this._agg);
        }
      }
    }
  }

  /**
   * A `agg` getter.
   */
  public get agg(): null | string {
    return this._agg;
  }

  /**
   * A `asc` setter.
   */
  public set asc(val: null | string) {
    if (val === null || val === "" || FIELD_ASC_REGEXP.test(val)) {
      const old = this._asc;
      this._asc = val;
      this.requestUpdate("asc", old);
    } else {
      console.error(
        `The \`asc\` property value "${val}" doesn't match an ` +
          "element RegExp.",
      );
      if (this.getAttribute("asc") === val) {
        if (this._asc === null) {
          this.removeAttribute("asc");
        } else {
          this.setAttribute("asc", this._asc);
        }
      }
    }
  }

  /**
   * A `asc` getter.
   */
  public get asc(): null | string {
    return this._asc;
  }

  /**
   * @override
   */
  public connectedCallback(): void {
    super.connectedCallback();
    this._parent = this._getParent();
    if (this._parent) {
      this._parent.dispatchEvent(
        new CustomEvent<FieldEventDetail>("hdml-field:connected", {
          cancelable: false,
          composed: false,
          bubbles: false,
          detail: {
            field: this,
          },
        }),
      );
    }
  }

  /**
   * @override
   */
  public attributeChangedCallback(
    name: string,
    old: string,
    value: string,
  ): void {
    super.attributeChangedCallback(name, old, value);
    this._dispatchChangedEvent();
  }

  /**
   * @override
   */
  public disconnectedCallback(): void {
    if (this._parent) {
      this._parent.dispatchEvent(
        new CustomEvent<FieldEventDetail>("hdml-field:disconnected", {
          cancelable: false,
          composed: false,
          bubbles: false,
          detail: {
            field: this,
          },
        }),
      );
      this._parent = null;
    }
    super.disconnectedCallback();
  }

  /**
   * Component template.
   */
  public render(): TemplateResult<1> {
    return html`<!-- FieldElement -->`;
  }

  /**
   * Returns field's `JSON`-representation.
   */
  public toJSON(): FieldData {
    if (!this.name) {
      throw new Error("A `name` property is required.");
    }
    if (this.origin && this.clause) {
      throw new Error(
        "An `origin` and a `clause` attributes couldn't be set " +
          "together.",
      );
    }
    return {
      description: undefined,
      origin: this.origin ? this.origin : undefined,
      clause: this.clause ? this.clause : undefined,
      name: this.name,
      type: this._getType(),
      agg: this._getAgg(),
      asc: this.asc && this.asc !== "false" ? true : false,
    };
  }

  /**
   * Returns an assosiated `hdml-table`, `hdml-frame`,
   * `hdml-group-by` or `hdml-sort-by` element if exist or null
   * otherwise.
   */
  private _getParent(): null | Element {
    let element = this.parentElement;
    while (
      element &&
      element.tagName !== "BODY" &&
      element.tagName !== getTableTag().toUpperCase() &&
      element.tagName !== getFrameTag().toUpperCase() &&
      element.tagName !== getGroupByTag().toUpperCase() &&
      element.tagName !== getSortByTag().toUpperCase()
    ) {
      element = element.parentElement;
    }
    return element && element.tagName !== "BODY" ? element : null;
  }

  /**
   * Dispatches the `hdml-field:changed` event.
   */
  private _dispatchChangedEvent(): void {
    this.dispatchEvent(
      new CustomEvent<FieldEventDetail>("hdml-field:changed", {
        cancelable: false,
        composed: false,
        bubbles: false,
        detail: {
          field: this,
        },
      }),
    );
  }

  /**
   * Returns the field type.
   */
  private _getType(): undefined | TypeData {
    let opts:
      | CommonOptsData
      | DecimalOptsData
      | DateOptsData
      | TimeOptsData
      | TimestampOptsData;
    if (!this.type) {
      return undefined;
    } else {
      switch (this.type) {
        case "int-8":
        case "int-16":
        case "int-32":
        case "int-64":
        case "uint-8":
        case "uint-16":
        case "uint-32":
        case "uint-64":
        case "float-16":
        case "float-32":
        case "float-64":
        case "binary":
        case "utf-8":
          opts = this._getCommonOpts();
          break;
        case "decimal":
          opts = this._getDecimalOpts();
          break;
        case "date":
          opts = this._getDateOpts();
          break;
        case "time":
          opts = this._getTimeOpts();
          break;
        case "timestamp":
          opts = this._getTimestampOpts();
          break;
        default:
          throw new Error("Unsupported `type` attribute value.");
      }
      return <TypeData>{
        type: this._getDataType(),
        options: opts,
      };
    }
  }

  /**
   * Returns field data type code.
   */
  private _getDataType(): DataType {
    switch (this.type) {
      case "int-8":
        return DataType.Int8;
      case "int-16":
        return DataType.Int16;
      case "int-32":
        return DataType.Int32;
      case "int-64":
        return DataType.Int64;
      case "uint-8":
        return DataType.Uint8;
      case "uint-16":
        return DataType.Uint16;
      case "uint-32":
        return DataType.Uint32;
      case "uint-64":
        return DataType.Uint64;
      case "float-16":
        return DataType.Float16;
      case "float-32":
        return DataType.Float32;
      case "float-64":
        return DataType.Float64;
      case "binary":
        return DataType.Binary;
      case "utf-8":
        return DataType.Utf8;
      case "decimal":
        return DataType.Decimal;
      case "date":
        return DataType.Date;
      case "time":
        return DataType.Time;
      case "timestamp":
        return DataType.Timestamp;
      default:
        throw new Error("Unsupported `type` attribute value.");
    }
  }

  /**
   * Returns common data type options object.
   */
  private _getCommonOpts(): CommonOptsData {
    return {
      nullable:
        this.nullable && this.nullable !== "false" ? true : false,
    };
  }

  /**
   * Returns decimal data type options object.
   */
  private _getDecimalOpts(): DecimalOptsData {
    if (!this.scale) {
      throw new Error("A `scale` property is required.");
    }
    if (!this.precision) {
      throw new Error("A `precision` property is required.");
    }
    if (!this.bitWidth) {
      throw new Error("A `bitWidth` property is required.");
    }
    return {
      nullable:
        this.nullable && this.nullable !== "false" ? true : false,
      scale: parseInt(this.scale, 10),
      precision: parseInt(this.precision, 10),
      bitWidth: parseInt(this.bitWidth, 10),
    };
  }

  /**
   * Returns date data type options object.
   */
  private _getDateOpts(): DateOptsData {
    if (!this.unit) {
      throw new Error("A `unit` property is required.");
    }
    let unit: DateUnit;
    switch (this.unit) {
      case "second":
        unit = DateUnit.second;
        break;
      case "millisecond":
        unit = DateUnit.millisecond;
        break;
      default:
        throw new Error("Unsupported `unit` attribute value.");
    }
    return {
      unit,
      nullable:
        this.nullable && this.nullable !== "false" ? true : false,
    };
  }

  /**
   * Returns time data type options object.
   */
  private _getTimeOpts(): TimeOptsData {
    if (!this.unit) {
      throw new Error("A `unit` property is required.");
    }
    let unit: TimeUnit;
    switch (this.unit) {
      case "second":
        unit = TimeUnit.second;
        break;
      case "millisecond":
        unit = TimeUnit.millisecond;
        break;
      case "microsecond":
        unit = TimeUnit.microsecond;
        break;
      case "nanosecond":
        unit = TimeUnit.nanosecond;
        break;
      default:
        throw new Error("Unsupported `unit` attribute value.");
    }
    return {
      unit,
      nullable:
        this.nullable && this.nullable !== "false" ? true : false,
    };
  }

  /**
   * Returns timestamp data type options object.
   */
  private _getTimestampOpts(): TimestampOptsData {
    if (!this.unit) {
      throw new Error("A `unit` property is required.");
    }
    if (!this.timezone) {
      throw new Error("A `timezone` property is required.");
    }
    let unit: TimeUnit;
    switch (this.unit) {
      case "second":
        unit = TimeUnit.second;
        break;
      case "millisecond":
        unit = TimeUnit.millisecond;
        break;
      case "microsecond":
        unit = TimeUnit.microsecond;
        break;
      case "nanosecond":
        unit = TimeUnit.nanosecond;
        break;
      default:
        throw new Error("Unsupported `unit` attribute value.");
    }
    let timezone: TimeZone;
    switch (this.timezone) {
      default:
        throw new Error("Unsupported `timezone` attribute value.");
      case "Africa/Algiers":
        timezone = TimeZone.Africa_Algiers;
        break;
      case "Atlantic/Cape_Verde":
        timezone = TimeZone.Atlantic_Cape_Verde;
        break;
      case "Africa/Ndjamena":
        timezone = TimeZone.Africa_Ndjamena;
        break;
      case "Africa/Abidjan":
        timezone = TimeZone.Africa_Abidjan;
        break;
      case "Africa/Bamako":
        timezone = TimeZone.Africa_Bamako;
        break;
      case "Africa/Banjul":
        timezone = TimeZone.Africa_Banjul;
        break;
      case "Africa/Conakry":
        timezone = TimeZone.Africa_Conakry;
        break;
      case "Africa/Dakar":
        timezone = TimeZone.Africa_Dakar;
        break;
      case "Africa/Freetown":
        timezone = TimeZone.Africa_Freetown;
        break;
      case "Africa/Lome":
        timezone = TimeZone.Africa_Lome;
        break;
      case "Africa/Nouakchott":
        timezone = TimeZone.Africa_Nouakchott;
        break;
      case "Africa/Ouagadougou":
        timezone = TimeZone.Africa_Ouagadougou;
        break;
      case "Atlantic/St_Helena":
        timezone = TimeZone.Atlantic_St_Helena;
        break;
      case "Africa/Cairo":
        timezone = TimeZone.Africa_Cairo;
        break;
      case "Africa/Accra":
        timezone = TimeZone.Africa_Accra;
        break;
      case "Africa/Bissau":
        timezone = TimeZone.Africa_Bissau;
        break;
      case "Africa/Nairobi":
        timezone = TimeZone.Africa_Nairobi;
        break;
      case "Africa/Addis_Ababa":
        timezone = TimeZone.Africa_Addis_Ababa;
        break;
      case "Africa/Asmara":
        timezone = TimeZone.Africa_Asmara;
        break;
      case "Africa/Dar_es_Salaam":
        timezone = TimeZone.Africa_Dar_es_Salaam;
        break;
      case "Africa/Djibouti":
        timezone = TimeZone.Africa_Djibouti;
        break;
      case "Africa/Kampala":
        timezone = TimeZone.Africa_Kampala;
        break;
      case "Africa/Mogadishu":
        timezone = TimeZone.Africa_Mogadishu;
        break;
      case "Indian/Antananarivo":
        timezone = TimeZone.Indian_Antananarivo;
        break;
      case "Indian/Comoro":
        timezone = TimeZone.Indian_Comoro;
        break;
      case "Indian/Mayotte":
        timezone = TimeZone.Indian_Mayotte;
        break;
      case "Africa/Monrovia":
        timezone = TimeZone.Africa_Monrovia;
        break;
      case "Africa/Tripoli":
        timezone = TimeZone.Africa_Tripoli;
        break;
      case "Indian/Mauritius":
        timezone = TimeZone.Indian_Mauritius;
        break;
      case "Africa/Casablanca":
        timezone = TimeZone.Africa_Casablanca;
        break;
      case "Africa/El_Aaiun":
        timezone = TimeZone.Africa_El_Aaiun;
        break;
      case "Africa/Maputo":
        timezone = TimeZone.Africa_Maputo;
        break;
      case "Africa/Blantyre":
        timezone = TimeZone.Africa_Blantyre;
        break;
      case "Africa/Bujumbura":
        timezone = TimeZone.Africa_Bujumbura;
        break;
      case "Africa/Gaborone":
        timezone = TimeZone.Africa_Gaborone;
        break;
      case "Africa/Harare":
        timezone = TimeZone.Africa_Harare;
        break;
      case "Africa/Kigali":
        timezone = TimeZone.Africa_Kigali;
        break;
      case "Africa/Lubumbashi":
        timezone = TimeZone.Africa_Lubumbashi;
        break;
      case "Africa/Lusaka":
        timezone = TimeZone.Africa_Lusaka;
        break;
      case "Africa/Windhoek":
        timezone = TimeZone.Africa_Windhoek;
        break;
      case "Africa/Lagos":
        timezone = TimeZone.Africa_Lagos;
        break;
      case "Africa/Bangui":
        timezone = TimeZone.Africa_Bangui;
        break;
      case "Africa/Brazzaville":
        timezone = TimeZone.Africa_Brazzaville;
        break;
      case "Africa/Douala":
        timezone = TimeZone.Africa_Douala;
        break;
      case "Africa/Kinshasa":
        timezone = TimeZone.Africa_Kinshasa;
        break;
      case "Africa/Libreville":
        timezone = TimeZone.Africa_Libreville;
        break;
      case "Africa/Luanda":
        timezone = TimeZone.Africa_Luanda;
        break;
      case "Africa/Malabo":
        timezone = TimeZone.Africa_Malabo;
        break;
      case "Africa/Niamey":
        timezone = TimeZone.Africa_Niamey;
        break;
      case "Africa/Porto-Novo":
        timezone = TimeZone.Africa_Porto_Novo;
        break;
      case "Indian/Reunion":
        timezone = TimeZone.Indian_Reunion;
        break;
      case "Africa/Sao_Tome":
        timezone = TimeZone.Africa_Sao_Tome;
        break;
      case "Indian/Mahe":
        timezone = TimeZone.Indian_Mahe;
        break;
      case "Africa/Johannesburg":
        timezone = TimeZone.Africa_Johannesburg;
        break;
      case "Africa/Maseru":
        timezone = TimeZone.Africa_Maseru;
        break;
      case "Africa/Mbabane":
        timezone = TimeZone.Africa_Mbabane;
        break;
      case "Africa/Khartoum":
        timezone = TimeZone.Africa_Khartoum;
        break;
      case "Africa/Juba":
        timezone = TimeZone.Africa_Juba;
        break;
      case "Africa/Tunis":
        timezone = TimeZone.Africa_Tunis;
        break;
      case "Antarctica/Casey":
        timezone = TimeZone.Antarctica_Casey;
        break;
      case "Antarctica/Davis":
        timezone = TimeZone.Antarctica_Davis;
        break;
      case "Antarctica/Mawson":
        timezone = TimeZone.Antarctica_Mawson;
        break;
      case "Indian/Kerguelen":
        timezone = TimeZone.Indian_Kerguelen;
        break;
      case "Antarctica/DumontDUrville":
        timezone = TimeZone.Antarctica_DumontDUrville;
        break;
      case "Antarctica/Syowa":
        timezone = TimeZone.Antarctica_Syowa;
        break;
      case "Antarctica/Troll":
        timezone = TimeZone.Antarctica_Troll;
        break;
      case "Antarctica/Vostok":
        timezone = TimeZone.Antarctica_Vostok;
        break;
      case "Antarctica/Rothera":
        timezone = TimeZone.Antarctica_Rothera;
        break;
      case "Asia/Kabul":
        timezone = TimeZone.Asia_Kabul;
        break;
      case "Asia/Yerevan":
        timezone = TimeZone.Asia_Yerevan;
        break;
      case "Asia/Baku":
        timezone = TimeZone.Asia_Baku;
        break;
      case "Asia/Dhaka":
        timezone = TimeZone.Asia_Dhaka;
        break;
      case "Asia/Thimphu":
        timezone = TimeZone.Asia_Thimphu;
        break;
      case "Indian/Chagos":
        timezone = TimeZone.Indian_Chagos;
        break;
      case "Asia/Brunei":
        timezone = TimeZone.Asia_Brunei;
        break;
      case "Asia/Yangon":
        timezone = TimeZone.Asia_Yangon;
        break;
      case "Asia/Shanghai":
        timezone = TimeZone.Asia_Shanghai;
        break;
      case "Asia/Urumqi":
        timezone = TimeZone.Asia_Urumqi;
        break;
      case "Asia/Hong_Kong":
        timezone = TimeZone.Asia_Hong_Kong;
        break;
      case "Asia/Taipei":
        timezone = TimeZone.Asia_Taipei;
        break;
      case "Asia/Macau":
        timezone = TimeZone.Asia_Macau;
        break;
      case "Asia/Nicosia":
        timezone = TimeZone.Asia_Nicosia;
        break;
      case "Asia/Famagusta":
        timezone = TimeZone.Asia_Famagusta;
        break;
      case "Europe/Nicosia":
        timezone = TimeZone.Europe_Nicosia;
        break;
      case "Asia/Tbilisi":
        timezone = TimeZone.Asia_Tbilisi;
        break;
      case "Asia/Dili":
        timezone = TimeZone.Asia_Dili;
        break;
      case "Asia/Kolkata":
        timezone = TimeZone.Asia_Kolkata;
        break;
      case "Asia/Jakarta":
        timezone = TimeZone.Asia_Jakarta;
        break;
      case "Asia/Pontianak":
        timezone = TimeZone.Asia_Pontianak;
        break;
      case "Asia/Makassar":
        timezone = TimeZone.Asia_Makassar;
        break;
      case "Asia/Jayapura":
        timezone = TimeZone.Asia_Jayapura;
        break;
      case "Asia/Tehran":
        timezone = TimeZone.Asia_Tehran;
        break;
      case "Asia/Baghdad":
        timezone = TimeZone.Asia_Baghdad;
        break;
      case "Asia/Jerusalem":
        timezone = TimeZone.Asia_Jerusalem;
        break;
      case "Asia/Tokyo":
        timezone = TimeZone.Asia_Tokyo;
        break;
      case "Asia/Amman":
        timezone = TimeZone.Asia_Amman;
        break;
      case "Asia/Almaty":
        timezone = TimeZone.Asia_Almaty;
        break;
      case "Asia/Qyzylorda":
        timezone = TimeZone.Asia_Qyzylorda;
        break;
      case "Asia/Qostanay":
        timezone = TimeZone.Asia_Qostanay;
        break;
      case "Asia/Aqtobe":
        timezone = TimeZone.Asia_Aqtobe;
        break;
      case "Asia/Aqtau":
        timezone = TimeZone.Asia_Aqtau;
        break;
      case "Asia/Atyrau":
        timezone = TimeZone.Asia_Atyrau;
        break;
      case "Asia/Oral":
        timezone = TimeZone.Asia_Oral;
        break;
      case "Asia/Bishkek":
        timezone = TimeZone.Asia_Bishkek;
        break;
      case "Asia/Seoul":
        timezone = TimeZone.Asia_Seoul;
        break;
      case "Asia/Pyongyang":
        timezone = TimeZone.Asia_Pyongyang;
        break;
      case "Asia/Beirut":
        timezone = TimeZone.Asia_Beirut;
        break;
      case "Asia/Kuala_Lumpur":
        timezone = TimeZone.Asia_Kuala_Lumpur;
        break;
      case "Asia/Kuching":
        timezone = TimeZone.Asia_Kuching;
        break;
      case "Indian/Maldives":
        timezone = TimeZone.Indian_Maldives;
        break;
      case "Asia/Hovd":
        timezone = TimeZone.Asia_Hovd;
        break;
      case "Asia/Ulaanbaatar":
        timezone = TimeZone.Asia_Ulaanbaatar;
        break;
      case "Asia/Choibalsan":
        timezone = TimeZone.Asia_Choibalsan;
        break;
      case "Asia/Kathmandu":
        timezone = TimeZone.Asia_Kathmandu;
        break;
      case "Asia/Karachi":
        timezone = TimeZone.Asia_Karachi;
        break;
      case "Asia/Gaza":
        timezone = TimeZone.Asia_Gaza;
        break;
      case "Asia/Hebron":
        timezone = TimeZone.Asia_Hebron;
        break;
      case "Asia/Manila":
        timezone = TimeZone.Asia_Manila;
        break;
      case "Asia/Qatar":
        timezone = TimeZone.Asia_Qatar;
        break;
      case "Asia/Bahrain":
        timezone = TimeZone.Asia_Bahrain;
        break;
      case "Asia/Riyadh":
        timezone = TimeZone.Asia_Riyadh;
        break;
      case "Asia/Aden":
        timezone = TimeZone.Asia_Aden;
        break;
      case "Asia/Kuwait":
        timezone = TimeZone.Asia_Kuwait;
        break;
      case "Asia/Singapore":
        timezone = TimeZone.Asia_Singapore;
        break;
      case "Asia/Colombo":
        timezone = TimeZone.Asia_Colombo;
        break;
      case "Asia/Damascus":
        timezone = TimeZone.Asia_Damascus;
        break;
      case "Asia/Dushanbe":
        timezone = TimeZone.Asia_Dushanbe;
        break;
      case "Asia/Bangkok":
        timezone = TimeZone.Asia_Bangkok;
        break;
      case "Asia/Phnom_Penh":
        timezone = TimeZone.Asia_Phnom_Penh;
        break;
      case "Asia/Vientiane":
        timezone = TimeZone.Asia_Vientiane;
        break;
      case "Asia/Ashgabat":
        timezone = TimeZone.Asia_Ashgabat;
        break;
      case "Asia/Dubai":
        timezone = TimeZone.Asia_Dubai;
        break;
      case "Asia/Muscat":
        timezone = TimeZone.Asia_Muscat;
        break;
      case "Asia/Samarkand":
        timezone = TimeZone.Asia_Samarkand;
        break;
      case "Asia/Tashkent":
        timezone = TimeZone.Asia_Tashkent;
        break;
      case "Asia/Ho_Chi_Minh":
        timezone = TimeZone.Asia_Ho_Chi_Minh;
        break;
      case "Australia/Darwin":
        timezone = TimeZone.Australia_Darwin;
        break;
      case "Australia/Perth":
        timezone = TimeZone.Australia_Perth;
        break;
      case "Australia/Eucla":
        timezone = TimeZone.Australia_Eucla;
        break;
      case "Australia/Brisbane":
        timezone = TimeZone.Australia_Brisbane;
        break;
      case "Australia/Lindeman":
        timezone = TimeZone.Australia_Lindeman;
        break;
      case "Australia/Adelaide":
        timezone = TimeZone.Australia_Adelaide;
        break;
      case "Australia/Hobart":
        timezone = TimeZone.Australia_Hobart;
        break;
      case "Australia/Currie":
        timezone = TimeZone.Australia_Currie;
        break;
      case "Australia/Melbourne":
        timezone = TimeZone.Australia_Melbourne;
        break;
      case "Australia/Sydney":
        timezone = TimeZone.Australia_Sydney;
        break;
      case "Australia/Broken_Hill":
        timezone = TimeZone.Australia_Broken_Hill;
        break;
      case "Australia/Lord_Howe":
        timezone = TimeZone.Australia_Lord_Howe;
        break;
      case "Antarctica/Macquarie":
        timezone = TimeZone.Antarctica_Macquarie;
        break;
      case "Indian/Christmas":
        timezone = TimeZone.Indian_Christmas;
        break;
      case "Indian/Cocos":
        timezone = TimeZone.Indian_Cocos;
        break;
      case "Pacific/Fiji":
        timezone = TimeZone.Pacific_Fiji;
        break;
      case "Pacific/Gambier":
        timezone = TimeZone.Pacific_Gambier;
        break;
      case "Pacific/Marquesas":
        timezone = TimeZone.Pacific_Marquesas;
        break;
      case "Pacific/Tahiti":
        timezone = TimeZone.Pacific_Tahiti;
        break;
      case "Pacific/Guam":
        timezone = TimeZone.Pacific_Guam;
        break;
      case "Pacific/Saipan":
        timezone = TimeZone.Pacific_Saipan;
        break;
      case "Pacific/Tarawa":
        timezone = TimeZone.Pacific_Tarawa;
        break;
      case "Pacific/Enderbury":
        timezone = TimeZone.Pacific_Enderbury;
        break;
      case "Pacific/Kiritimati":
        timezone = TimeZone.Pacific_Kiritimati;
        break;
      case "Pacific/Majuro":
        timezone = TimeZone.Pacific_Majuro;
        break;
      case "Pacific/Kwajalein":
        timezone = TimeZone.Pacific_Kwajalein;
        break;
      case "Pacific/Chuuk":
        timezone = TimeZone.Pacific_Chuuk;
        break;
      case "Pacific/Pohnpei":
        timezone = TimeZone.Pacific_Pohnpei;
        break;
      case "Pacific/Kosrae":
        timezone = TimeZone.Pacific_Kosrae;
        break;
      case "Pacific/Nauru":
        timezone = TimeZone.Pacific_Nauru;
        break;
      case "Pacific/Noumea":
        timezone = TimeZone.Pacific_Noumea;
        break;
      case "Pacific/Auckland":
        timezone = TimeZone.Pacific_Auckland;
        break;
      case "Pacific/Chatham":
        timezone = TimeZone.Pacific_Chatham;
        break;
      case "Antarctica/McMurdo":
        timezone = TimeZone.Antarctica_McMurdo;
        break;
      case "Pacific/Rarotonga":
        timezone = TimeZone.Pacific_Rarotonga;
        break;
      case "Pacific/Niue":
        timezone = TimeZone.Pacific_Niue;
        break;
      case "Pacific/Norfolk":
        timezone = TimeZone.Pacific_Norfolk;
        break;
      case "Pacific/Palau":
        timezone = TimeZone.Pacific_Palau;
        break;
      case "Pacific/Port_Moresby":
        timezone = TimeZone.Pacific_Port_Moresby;
        break;
      case "Pacific/Bougainville":
        timezone = TimeZone.Pacific_Bougainville;
        break;
      case "Pacific/Pitcairn":
        timezone = TimeZone.Pacific_Pitcairn;
        break;
      case "Pacific/Pago_Pago":
        timezone = TimeZone.Pacific_Pago_Pago;
        break;
      case "Pacific/Midway":
        timezone = TimeZone.Pacific_Midway;
        break;
      case "Pacific/Apia":
        timezone = TimeZone.Pacific_Apia;
        break;
      case "Pacific/Guadalcanal":
        timezone = TimeZone.Pacific_Guadalcanal;
        break;
      case "Pacific/Fakaofo":
        timezone = TimeZone.Pacific_Fakaofo;
        break;
      case "Pacific/Tongatapu":
        timezone = TimeZone.Pacific_Tongatapu;
        break;
      case "Pacific/Funafuti":
        timezone = TimeZone.Pacific_Funafuti;
        break;
      case "Pacific/Wake":
        timezone = TimeZone.Pacific_Wake;
        break;
      case "Pacific/Efate":
        timezone = TimeZone.Pacific_Efate;
        break;
      case "Pacific/Wallis":
        timezone = TimeZone.Pacific_Wallis;
        break;
      case "Africa/Asmera":
        timezone = TimeZone.Africa_Asmera;
        break;
      case "Africa/Timbuktu":
        timezone = TimeZone.Africa_Timbuktu;
        break;
      case "America/Argentina/ComodRivadavia":
        timezone = TimeZone.America_Argentina_ComodRivadavia;
        break;
      case "America/Atka":
        timezone = TimeZone.America_Atka;
        break;
      case "America/Buenos_Aires":
        timezone = TimeZone.America_Buenos_Aires;
        break;
      case "America/Catamarca":
        timezone = TimeZone.America_Catamarca;
        break;
      case "America/Coral_Harbour":
        timezone = TimeZone.America_Coral_Harbour;
        break;
      case "America/Cordoba":
        timezone = TimeZone.America_Cordoba;
        break;
      case "America/Ensenada":
        timezone = TimeZone.America_Ensenada;
        break;
      case "America/Fort_Wayne":
        timezone = TimeZone.America_Fort_Wayne;
        break;
      case "America/Indianapolis":
        timezone = TimeZone.America_Indianapolis;
        break;
      case "America/Jujuy":
        timezone = TimeZone.America_Jujuy;
        break;
      case "America/Knox_IN":
        timezone = TimeZone.America_Knox_IN;
        break;
      case "America/Louisville":
        timezone = TimeZone.America_Louisville;
        break;
      case "America/Mendoza":
        timezone = TimeZone.America_Mendoza;
        break;
      case "America/Montreal":
        timezone = TimeZone.America_Montreal;
        break;
      case "America/Porto_Acre":
        timezone = TimeZone.America_Porto_Acre;
        break;
      case "America/Rosario":
        timezone = TimeZone.America_Rosario;
        break;
      case "America/Santa_Isabel":
        timezone = TimeZone.America_Santa_Isabel;
        break;
      case "America/Shiprock":
        timezone = TimeZone.America_Shiprock;
        break;
      case "America/Virgin":
        timezone = TimeZone.America_Virgin;
        break;
      case "Antarctica/South_Pole":
        timezone = TimeZone.Antarctica_South_Pole;
        break;
      case "Asia/Ashkhabad":
        timezone = TimeZone.Asia_Ashkhabad;
        break;
      case "Asia/Calcutta":
        timezone = TimeZone.Asia_Calcutta;
        break;
      case "Asia/Chongqing":
        timezone = TimeZone.Asia_Chongqing;
        break;
      case "Asia/Chungking":
        timezone = TimeZone.Asia_Chungking;
        break;
      case "Asia/Dacca":
        timezone = TimeZone.Asia_Dacca;
        break;
      case "Asia/Harbin":
        timezone = TimeZone.Asia_Harbin;
        break;
      case "Asia/Kashgar":
        timezone = TimeZone.Asia_Kashgar;
        break;
      case "Asia/Katmandu":
        timezone = TimeZone.Asia_Katmandu;
        break;
      case "Asia/Macao":
        timezone = TimeZone.Asia_Macao;
        break;
      case "Asia/Rangoon":
        timezone = TimeZone.Asia_Rangoon;
        break;
      case "Asia/Saigon":
        timezone = TimeZone.Asia_Saigon;
        break;
      case "Asia/Tel_Aviv":
        timezone = TimeZone.Asia_Tel_Aviv;
        break;
      case "Asia/Thimbu":
        timezone = TimeZone.Asia_Thimbu;
        break;
      case "Asia/Ujung_Pandang":
        timezone = TimeZone.Asia_Ujung_Pandang;
        break;
      case "Asia/Ulan_Bator":
        timezone = TimeZone.Asia_Ulan_Bator;
        break;
      case "Atlantic/Faeroe":
        timezone = TimeZone.Atlantic_Faeroe;
        break;
      case "Atlantic/Jan_Mayen":
        timezone = TimeZone.Atlantic_Jan_Mayen;
        break;
      case "Australia/ACT":
        timezone = TimeZone.Australia_ACT;
        break;
      case "Australia/Canberra":
        timezone = TimeZone.Australia_Canberra;
        break;
      case "Australia/LHI":
        timezone = TimeZone.Australia_LHI;
        break;
      case "Australia/NSW":
        timezone = TimeZone.Australia_NSW;
        break;
      case "Australia/North":
        timezone = TimeZone.Australia_North;
        break;
      case "Australia/Queensland":
        timezone = TimeZone.Australia_Queensland;
        break;
      case "Australia/South":
        timezone = TimeZone.Australia_South;
        break;
      case "Australia/Tasmania":
        timezone = TimeZone.Australia_Tasmania;
        break;
      case "Australia/Victoria":
        timezone = TimeZone.Australia_Victoria;
        break;
      case "Australia/West":
        timezone = TimeZone.Australia_West;
        break;
      case "Australia/Yancowinna":
        timezone = TimeZone.Australia_Yancowinna;
        break;
      case "Brazil/Acre":
        timezone = TimeZone.Brazil_Acre;
        break;
      case "Brazil/DeNoronha":
        timezone = TimeZone.Brazil_DeNoronha;
        break;
      case "Brazil/East":
        timezone = TimeZone.Brazil_East;
        break;
      case "Brazil/West":
        timezone = TimeZone.Brazil_West;
        break;
      case "Canada/Atlantic":
        timezone = TimeZone.Canada_Atlantic;
        break;
      case "Canada/Central":
        timezone = TimeZone.Canada_Central;
        break;
      case "Canada/Eastern":
        timezone = TimeZone.Canada_Eastern;
        break;
      case "Canada/Mountain":
        timezone = TimeZone.Canada_Mountain;
        break;
      case "Canada/Newfoundland":
        timezone = TimeZone.Canada_Newfoundland;
        break;
      case "Canada/Pacific":
        timezone = TimeZone.Canada_Pacific;
        break;
      case "Canada/Saskatchewan":
        timezone = TimeZone.Canada_Saskatchewan;
        break;
      case "Canada/Yukon":
        timezone = TimeZone.Canada_Yukon;
        break;
      case "Chile/Continental":
        timezone = TimeZone.Chile_Continental;
        break;
      case "Chile/EasterIsland":
        timezone = TimeZone.Chile_EasterIsland;
        break;
      case "Cuba":
        timezone = TimeZone.Cuba;
        break;
      case "Egypt":
        timezone = TimeZone.Egypt;
        break;
      case "Eire":
        timezone = TimeZone.Eire;
        break;
      case "Etc/UCT":
        timezone = TimeZone.Etc_UCT;
        break;
      case "Europe/Belfast":
        timezone = TimeZone.Europe_Belfast;
        break;
      case "Europe/Tiraspol":
        timezone = TimeZone.Europe_Tiraspol;
        break;
      case "GB":
        timezone = TimeZone.GB;
        break;
      case "GB-Eire":
        timezone = TimeZone.GB_Eire;
        break;
      case "GMT+0":
        timezone = TimeZone.GMT_0;
        break;
      case "GMT-0":
        timezone = TimeZone.GMT_0;
        break;
      case "GMT0":
        timezone = TimeZone.GMT0;
        break;
      case "Greenwich":
        timezone = TimeZone.Greenwich;
        break;
      case "Hongkong":
        timezone = TimeZone.Hongkong;
        break;
      case "Iceland":
        timezone = TimeZone.Iceland;
        break;
      case "Iran":
        timezone = TimeZone.Iran;
        break;
      case "Israel":
        timezone = TimeZone.Israel;
        break;
      case "Jamaica":
        timezone = TimeZone.Jamaica;
        break;
      case "Japan":
        timezone = TimeZone.Japan;
        break;
      case "Kwajalein":
        timezone = TimeZone.Kwajalein;
        break;
      case "Libya":
        timezone = TimeZone.Libya;
        break;
      case "Mexico/BajaNorte":
        timezone = TimeZone.Mexico_BajaNorte;
        break;
      case "Mexico/BajaSur":
        timezone = TimeZone.Mexico_BajaSur;
        break;
      case "Mexico/General":
        timezone = TimeZone.Mexico_General;
        break;
      case "NZ":
        timezone = TimeZone.NZ;
        break;
      case "NZ-CHAT":
        timezone = TimeZone.NZ_CHAT;
        break;
      case "Navajo":
        timezone = TimeZone.Navajo;
        break;
      case "PRC":
        timezone = TimeZone.PRC;
        break;
      case "Pacific/Johnston":
        timezone = TimeZone.Pacific_Johnston;
        break;
      case "Pacific/Ponape":
        timezone = TimeZone.Pacific_Ponape;
        break;
      case "Pacific/Samoa":
        timezone = TimeZone.Pacific_Samoa;
        break;
      case "Pacific/Truk":
        timezone = TimeZone.Pacific_Truk;
        break;
      case "Pacific/Yap":
        timezone = TimeZone.Pacific_Yap;
        break;
      case "Poland":
        timezone = TimeZone.Poland;
        break;
      case "Portugal":
        timezone = TimeZone.Portugal;
        break;
      case "ROC":
        timezone = TimeZone.ROC;
        break;
      case "ROK":
        timezone = TimeZone.ROK;
        break;
      case "Singapore":
        timezone = TimeZone.Singapore;
        break;
      case "Turkey":
        timezone = TimeZone.Turkey;
        break;
      case "UCT":
        timezone = TimeZone.UCT;
        break;
      case "US/Alaska":
        timezone = TimeZone.US_Alaska;
        break;
      case "US/Aleutian":
        timezone = TimeZone.US_Aleutian;
        break;
      case "US/Arizona":
        timezone = TimeZone.US_Arizona;
        break;
      case "US/Central":
        timezone = TimeZone.US_Central;
        break;
      case "US/East-Indiana":
        timezone = TimeZone.US_East_Indiana;
        break;
      case "US/Eastern":
        timezone = TimeZone.US_Eastern;
        break;
      case "US/Hawaii":
        timezone = TimeZone.US_Hawaii;
        break;
      case "US/Indiana-Starke":
        timezone = TimeZone.US_Indiana_Starke;
        break;
      case "US/Michigan":
        timezone = TimeZone.US_Michigan;
        break;
      case "US/Mountain":
        timezone = TimeZone.US_Mountain;
        break;
      case "US/Pacific":
        timezone = TimeZone.US_Pacific;
        break;
      case "US/Samoa":
        timezone = TimeZone.US_Samoa;
        break;
      case "UTC":
        timezone = TimeZone.UTC;
        break;
      case "Universal":
        timezone = TimeZone.Universal;
        break;
      case "W-SU":
        timezone = TimeZone.W_SU;
        break;
      case "Zulu":
        timezone = TimeZone.Zulu;
        break;
      case "Etc/GMT":
        timezone = TimeZone.Etc_GMT;
        break;
      case "Etc/UTC":
        timezone = TimeZone.Etc_UTC;
        break;
      case "GMT":
        timezone = TimeZone.GMT;
        break;
      case "Etc/Universal":
        timezone = TimeZone.Etc_Universal;
        break;
      case "Etc/Zulu":
        timezone = TimeZone.Etc_Zulu;
        break;
      case "Etc/Greenwich":
        timezone = TimeZone.Etc_Greenwich;
        break;
      case "Etc/GMT-0":
        timezone = TimeZone.Etc_GMT_0;
        break;
      case "Etc/GMT+0":
        timezone = TimeZone.Etc_GMT_0;
        break;
      case "Etc/GMT0":
        timezone = TimeZone.Etc_GMT0;
        break;
      case "Etc/GMT-14":
        timezone = TimeZone.Etc_GMT_14;
        break;
      case "Etc/GMT-13":
        timezone = TimeZone.Etc_GMT_13;
        break;
      case "Etc/GMT-12":
        timezone = TimeZone.Etc_GMT_12;
        break;
      case "Etc/GMT-11":
        timezone = TimeZone.Etc_GMT_11;
        break;
      case "Etc/GMT-10":
        timezone = TimeZone.Etc_GMT_10;
        break;
      case "Etc/GMT-9":
        timezone = TimeZone.Etc_GMT_9;
        break;
      case "Etc/GMT-8":
        timezone = TimeZone.Etc_GMT_8;
        break;
      case "Etc/GMT-7":
        timezone = TimeZone.Etc_GMT_7;
        break;
      case "Etc/GMT-6":
        timezone = TimeZone.Etc_GMT_6;
        break;
      case "Etc/GMT-5":
        timezone = TimeZone.Etc_GMT_5;
        break;
      case "Etc/GMT-4":
        timezone = TimeZone.Etc_GMT_4;
        break;
      case "Etc/GMT-3":
        timezone = TimeZone.Etc_GMT_3;
        break;
      case "Etc/GMT-2":
        timezone = TimeZone.Etc_GMT_2;
        break;
      case "Etc/GMT-1":
        timezone = TimeZone.Etc_GMT_1;
        break;
      case "Etc/GMT+1":
        timezone = TimeZone.Etc_GMT_1;
        break;
      case "Etc/GMT+2":
        timezone = TimeZone.Etc_GMT_2;
        break;
      case "Etc/GMT+3":
        timezone = TimeZone.Etc_GMT_3;
        break;
      case "Etc/GMT+4":
        timezone = TimeZone.Etc_GMT_4;
        break;
      case "Etc/GMT+5":
        timezone = TimeZone.Etc_GMT_5;
        break;
      case "Etc/GMT+6":
        timezone = TimeZone.Etc_GMT_6;
        break;
      case "Etc/GMT+7":
        timezone = TimeZone.Etc_GMT_7;
        break;
      case "Etc/GMT+8":
        timezone = TimeZone.Etc_GMT_8;
        break;
      case "Etc/GMT+9":
        timezone = TimeZone.Etc_GMT_9;
        break;
      case "Etc/GMT+10":
        timezone = TimeZone.Etc_GMT_10;
        break;
      case "Etc/GMT+11":
        timezone = TimeZone.Etc_GMT_11;
        break;
      case "Etc/GMT+12":
        timezone = TimeZone.Etc_GMT_12;
        break;
      case "Europe/London":
        timezone = TimeZone.Europe_London;
        break;
      case "Europe/Jersey":
        timezone = TimeZone.Europe_Jersey;
        break;
      case "Europe/Guernsey":
        timezone = TimeZone.Europe_Guernsey;
        break;
      case "Europe/Isle_of_Man":
        timezone = TimeZone.Europe_Isle_of_Man;
        break;
      case "Europe/Dublin":
        timezone = TimeZone.Europe_Dublin;
        break;
      case "WET":
        timezone = TimeZone.WET;
        break;
      case "CET":
        timezone = TimeZone.CET;
        break;
      case "MET":
        timezone = TimeZone.MET;
        break;
      case "EET":
        timezone = TimeZone.EET;
        break;
      case "Europe/Tirane":
        timezone = TimeZone.Europe_Tirane;
        break;
      case "Europe/Andorra":
        timezone = TimeZone.Europe_Andorra;
        break;
      case "Europe/Vienna":
        timezone = TimeZone.Europe_Vienna;
        break;
      case "Europe/Minsk":
        timezone = TimeZone.Europe_Minsk;
        break;
      case "Europe/Brussels":
        timezone = TimeZone.Europe_Brussels;
        break;
      case "Europe/Sofia":
        timezone = TimeZone.Europe_Sofia;
        break;
      case "Europe/Prague":
        timezone = TimeZone.Europe_Prague;
        break;
      case "Europe/Copenhagen":
        timezone = TimeZone.Europe_Copenhagen;
        break;
      case "Atlantic/Faroe":
        timezone = TimeZone.Atlantic_Faroe;
        break;
      case "America/Danmarkshavn":
        timezone = TimeZone.America_Danmarkshavn;
        break;
      case "America/Scoresbysund":
        timezone = TimeZone.America_Scoresbysund;
        break;
      case "America/Godthab":
        timezone = TimeZone.America_Godthab;
        break;
      case "America/Thule":
        timezone = TimeZone.America_Thule;
        break;
      case "Europe/Tallinn":
        timezone = TimeZone.Europe_Tallinn;
        break;
      case "Europe/Helsinki":
        timezone = TimeZone.Europe_Helsinki;
        break;
      case "Europe/Mariehamn":
        timezone = TimeZone.Europe_Mariehamn;
        break;
      case "Europe/Paris":
        timezone = TimeZone.Europe_Paris;
        break;
      case "Europe/Berlin":
        timezone = TimeZone.Europe_Berlin;
        break;
      case "Europe/Busingen":
        timezone = TimeZone.Europe_Busingen;
        break;
      case "Europe/Gibraltar":
        timezone = TimeZone.Europe_Gibraltar;
        break;
      case "Europe/Athens":
        timezone = TimeZone.Europe_Athens;
        break;
      case "Europe/Budapest":
        timezone = TimeZone.Europe_Budapest;
        break;
      case "Atlantic/Reykjavik":
        timezone = TimeZone.Atlantic_Reykjavik;
        break;
      case "Europe/Rome":
        timezone = TimeZone.Europe_Rome;
        break;
      case "Europe/Vatican":
        timezone = TimeZone.Europe_Vatican;
        break;
      case "Europe/San_Marino":
        timezone = TimeZone.Europe_San_Marino;
        break;
      case "Europe/Riga":
        timezone = TimeZone.Europe_Riga;
        break;
      case "Europe/Vaduz":
        timezone = TimeZone.Europe_Vaduz;
        break;
      case "Europe/Vilnius":
        timezone = TimeZone.Europe_Vilnius;
        break;
      case "Europe/Luxembourg":
        timezone = TimeZone.Europe_Luxembourg;
        break;
      case "Europe/Malta":
        timezone = TimeZone.Europe_Malta;
        break;
      case "Europe/Chisinau":
        timezone = TimeZone.Europe_Chisinau;
        break;
      case "Europe/Monaco":
        timezone = TimeZone.Europe_Monaco;
        break;
      case "Europe/Amsterdam":
        timezone = TimeZone.Europe_Amsterdam;
        break;
      case "Europe/Oslo":
        timezone = TimeZone.Europe_Oslo;
        break;
      case "Arctic/Longyearbyen":
        timezone = TimeZone.Arctic_Longyearbyen;
        break;
      case "Europe/Warsaw":
        timezone = TimeZone.Europe_Warsaw;
        break;
      case "Europe/Lisbon":
        timezone = TimeZone.Europe_Lisbon;
        break;
      case "Atlantic/Azores":
        timezone = TimeZone.Atlantic_Azores;
        break;
      case "Atlantic/Madeira":
        timezone = TimeZone.Atlantic_Madeira;
        break;
      case "Europe/Bucharest":
        timezone = TimeZone.Europe_Bucharest;
        break;
      case "Europe/Kaliningrad":
        timezone = TimeZone.Europe_Kaliningrad;
        break;
      case "Europe/Moscow":
        timezone = TimeZone.Europe_Moscow;
        break;
      case "Europe/Simferopol":
        timezone = TimeZone.Europe_Simferopol;
        break;
      case "Europe/Astrakhan":
        timezone = TimeZone.Europe_Astrakhan;
        break;
      case "Europe/Volgograd":
        timezone = TimeZone.Europe_Volgograd;
        break;
      case "Europe/Saratov":
        timezone = TimeZone.Europe_Saratov;
        break;
      case "Europe/Kirov":
        timezone = TimeZone.Europe_Kirov;
        break;
      case "Europe/Samara":
        timezone = TimeZone.Europe_Samara;
        break;
      case "Europe/Ulyanovsk":
        timezone = TimeZone.Europe_Ulyanovsk;
        break;
      case "Asia/Yekaterinburg":
        timezone = TimeZone.Asia_Yekaterinburg;
        break;
      case "Asia/Omsk":
        timezone = TimeZone.Asia_Omsk;
        break;
      case "Asia/Barnaul":
        timezone = TimeZone.Asia_Barnaul;
        break;
      case "Asia/Novosibirsk":
        timezone = TimeZone.Asia_Novosibirsk;
        break;
      case "Asia/Tomsk":
        timezone = TimeZone.Asia_Tomsk;
        break;
      case "Asia/Novokuznetsk":
        timezone = TimeZone.Asia_Novokuznetsk;
        break;
      case "Asia/Krasnoyarsk":
        timezone = TimeZone.Asia_Krasnoyarsk;
        break;
      case "Asia/Irkutsk":
        timezone = TimeZone.Asia_Irkutsk;
        break;
      case "Asia/Chita":
        timezone = TimeZone.Asia_Chita;
        break;
      case "Asia/Yakutsk":
        timezone = TimeZone.Asia_Yakutsk;
        break;
      case "Asia/Vladivostok":
        timezone = TimeZone.Asia_Vladivostok;
        break;
      case "Asia/Khandyga":
        timezone = TimeZone.Asia_Khandyga;
        break;
      case "Asia/Sakhalin":
        timezone = TimeZone.Asia_Sakhalin;
        break;
      case "Asia/Magadan":
        timezone = TimeZone.Asia_Magadan;
        break;
      case "Asia/Srednekolymsk":
        timezone = TimeZone.Asia_Srednekolymsk;
        break;
      case "Asia/Ust-Nera":
        timezone = TimeZone.Asia_Ust_Nera;
        break;
      case "Asia/Kamchatka":
        timezone = TimeZone.Asia_Kamchatka;
        break;
      case "Asia/Anadyr":
        timezone = TimeZone.Asia_Anadyr;
        break;
      case "Europe/Belgrade":
        timezone = TimeZone.Europe_Belgrade;
        break;
      case "Europe/Ljubljana":
        timezone = TimeZone.Europe_Ljubljana;
        break;
      case "Europe/Podgorica":
        timezone = TimeZone.Europe_Podgorica;
        break;
      case "Europe/Sarajevo":
        timezone = TimeZone.Europe_Sarajevo;
        break;
      case "Europe/Skopje":
        timezone = TimeZone.Europe_Skopje;
        break;
      case "Europe/Zagreb":
        timezone = TimeZone.Europe_Zagreb;
        break;
      case "Europe/Bratislava":
        timezone = TimeZone.Europe_Bratislava;
        break;
      case "Europe/Madrid":
        timezone = TimeZone.Europe_Madrid;
        break;
      case "Africa/Ceuta":
        timezone = TimeZone.Africa_Ceuta;
        break;
      case "Atlantic/Canary":
        timezone = TimeZone.Atlantic_Canary;
        break;
      case "Europe/Stockholm":
        timezone = TimeZone.Europe_Stockholm;
        break;
      case "Europe/Zurich":
        timezone = TimeZone.Europe_Zurich;
        break;
      case "Europe/Istanbul":
        timezone = TimeZone.Europe_Istanbul;
        break;
      case "Asia/Istanbul":
        timezone = TimeZone.Asia_Istanbul;
        break;
      case "Europe/Kiev":
        timezone = TimeZone.Europe_Kiev;
        break;
      case "Europe/Uzhgorod":
        timezone = TimeZone.Europe_Uzhgorod;
        break;
      case "Europe/Zaporozhye":
        timezone = TimeZone.Europe_Zaporozhye;
        break;
      case "Factory":
        timezone = TimeZone.Factory;
        break;
      case "EST":
        timezone = TimeZone.EST;
        break;
      case "MST":
        timezone = TimeZone.MST;
        break;
      case "HST":
        timezone = TimeZone.HST;
        break;
      case "EST5EDT":
        timezone = TimeZone.EST5EDT;
        break;
      case "CST6CDT":
        timezone = TimeZone.CST6CDT;
        break;
      case "MST7MDT":
        timezone = TimeZone.MST7MDT;
        break;
      case "PST8PDT":
        timezone = TimeZone.PST8PDT;
        break;
      case "America/New_York":
        timezone = TimeZone.America_New_York;
        break;
      case "America/Chicago":
        timezone = TimeZone.America_Chicago;
        break;
      case "America/North_Dakota/Center":
        timezone = TimeZone.America_North_Dakota_Center;
        break;
      case "America/North_Dakota/New_Salem":
        timezone = TimeZone.America_North_Dakota_New_Salem;
        break;
      case "America/North_Dakota/Beulah":
        timezone = TimeZone.America_North_Dakota_Beulah;
        break;
      case "America/Denver":
        timezone = TimeZone.America_Denver;
        break;
      case "America/Los_Angeles":
        timezone = TimeZone.America_Los_Angeles;
        break;
      case "America/Juneau":
        timezone = TimeZone.America_Juneau;
        break;
      case "America/Sitka":
        timezone = TimeZone.America_Sitka;
        break;
      case "America/Metlakatla":
        timezone = TimeZone.America_Metlakatla;
        break;
      case "America/Yakutat":
        timezone = TimeZone.America_Yakutat;
        break;
      case "America/Anchorage":
        timezone = TimeZone.America_Anchorage;
        break;
      case "America/Nome":
        timezone = TimeZone.America_Nome;
        break;
      case "America/Adak":
        timezone = TimeZone.America_Adak;
        break;
      case "Pacific/Honolulu":
        timezone = TimeZone.Pacific_Honolulu;
        break;
      case "America/Phoenix":
        timezone = TimeZone.America_Phoenix;
        break;
      case "America/Boise":
        timezone = TimeZone.America_Boise;
        break;
      case "America/Indiana/Indianapolis":
        timezone = TimeZone.America_Indiana_Indianapolis;
        break;
      case "America/Indiana/Marengo":
        timezone = TimeZone.America_Indiana_Marengo;
        break;
      case "America/Indiana/Vincennes":
        timezone = TimeZone.America_Indiana_Vincennes;
        break;
      case "America/Indiana/Tell_City":
        timezone = TimeZone.America_Indiana_Tell_City;
        break;
      case "America/Indiana/Petersburg":
        timezone = TimeZone.America_Indiana_Petersburg;
        break;
      case "America/Indiana/Knox":
        timezone = TimeZone.America_Indiana_Knox;
        break;
      case "America/Indiana/Winamac":
        timezone = TimeZone.America_Indiana_Winamac;
        break;
      case "America/Indiana/Vevay":
        timezone = TimeZone.America_Indiana_Vevay;
        break;
      case "America/Kentucky/Louisville":
        timezone = TimeZone.America_Kentucky_Louisville;
        break;
      case "America/Kentucky/Monticello":
        timezone = TimeZone.America_Kentucky_Monticello;
        break;
      case "America/Detroit":
        timezone = TimeZone.America_Detroit;
        break;
      case "America/Menominee":
        timezone = TimeZone.America_Menominee;
        break;
      case "America/St_Johns":
        timezone = TimeZone.America_St_Johns;
        break;
      case "America/Goose_Bay":
        timezone = TimeZone.America_Goose_Bay;
        break;
      case "America/Halifax":
        timezone = TimeZone.America_Halifax;
        break;
      case "America/Glace_Bay":
        timezone = TimeZone.America_Glace_Bay;
        break;
      case "America/Moncton":
        timezone = TimeZone.America_Moncton;
        break;
      case "America/Blanc-Sablon":
        timezone = TimeZone.America_Blanc_Sablon;
        break;
      case "America/Toronto":
        timezone = TimeZone.America_Toronto;
        break;
      case "America/Thunder_Bay":
        timezone = TimeZone.America_Thunder_Bay;
        break;
      case "America/Nipigon":
        timezone = TimeZone.America_Nipigon;
        break;
      case "America/Rainy_River":
        timezone = TimeZone.America_Rainy_River;
        break;
      case "America/Atikokan":
        timezone = TimeZone.America_Atikokan;
        break;
      case "America/Winnipeg":
        timezone = TimeZone.America_Winnipeg;
        break;
      case "America/Regina":
        timezone = TimeZone.America_Regina;
        break;
      case "America/Swift_Current":
        timezone = TimeZone.America_Swift_Current;
        break;
      case "America/Edmonton":
        timezone = TimeZone.America_Edmonton;
        break;
      case "America/Vancouver":
        timezone = TimeZone.America_Vancouver;
        break;
      case "America/Dawson_Creek":
        timezone = TimeZone.America_Dawson_Creek;
        break;
      case "America/Fort_Nelson":
        timezone = TimeZone.America_Fort_Nelson;
        break;
      case "America/Creston":
        timezone = TimeZone.America_Creston;
        break;
      case "America/Pangnirtung":
        timezone = TimeZone.America_Pangnirtung;
        break;
      case "America/Iqaluit":
        timezone = TimeZone.America_Iqaluit;
        break;
      case "America/Resolute":
        timezone = TimeZone.America_Resolute;
        break;
      case "America/Rankin_Inlet":
        timezone = TimeZone.America_Rankin_Inlet;
        break;
      case "America/Cambridge_Bay":
        timezone = TimeZone.America_Cambridge_Bay;
        break;
      case "America/Yellowknife":
        timezone = TimeZone.America_Yellowknife;
        break;
      case "America/Inuvik":
        timezone = TimeZone.America_Inuvik;
        break;
      case "America/Whitehorse":
        timezone = TimeZone.America_Whitehorse;
        break;
      case "America/Dawson":
        timezone = TimeZone.America_Dawson;
        break;
      case "America/Cancun":
        timezone = TimeZone.America_Cancun;
        break;
      case "America/Merida":
        timezone = TimeZone.America_Merida;
        break;
      case "America/Matamoros":
        timezone = TimeZone.America_Matamoros;
        break;
      case "America/Monterrey":
        timezone = TimeZone.America_Monterrey;
        break;
      case "America/Mexico_City":
        timezone = TimeZone.America_Mexico_City;
        break;
      case "America/Ojinaga":
        timezone = TimeZone.America_Ojinaga;
        break;
      case "America/Chihuahua":
        timezone = TimeZone.America_Chihuahua;
        break;
      case "America/Hermosillo":
        timezone = TimeZone.America_Hermosillo;
        break;
      case "America/Mazatlan":
        timezone = TimeZone.America_Mazatlan;
        break;
      case "America/Bahia_Banderas":
        timezone = TimeZone.America_Bahia_Banderas;
        break;
      case "America/Tijuana":
        timezone = TimeZone.America_Tijuana;
        break;
      case "America/Nassau":
        timezone = TimeZone.America_Nassau;
        break;
      case "America/Barbados":
        timezone = TimeZone.America_Barbados;
        break;
      case "America/Belize":
        timezone = TimeZone.America_Belize;
        break;
      case "Atlantic/Bermuda":
        timezone = TimeZone.Atlantic_Bermuda;
        break;
      case "America/Costa_Rica":
        timezone = TimeZone.America_Costa_Rica;
        break;
      case "America/Havana":
        timezone = TimeZone.America_Havana;
        break;
      case "America/Santo_Domingo":
        timezone = TimeZone.America_Santo_Domingo;
        break;
      case "America/El_Salvador":
        timezone = TimeZone.America_El_Salvador;
        break;
      case "America/Guatemala":
        timezone = TimeZone.America_Guatemala;
        break;
      case "America/Port-au-Prince":
        timezone = TimeZone.America_Port_au_Prince;
        break;
      case "America/Tegucigalpa":
        timezone = TimeZone.America_Tegucigalpa;
        break;
      case "America/Jamaica":
        timezone = TimeZone.America_Jamaica;
        break;
      case "America/Martinique":
        timezone = TimeZone.America_Martinique;
        break;
      case "America/Managua":
        timezone = TimeZone.America_Managua;
        break;
      case "America/Panama":
        timezone = TimeZone.America_Panama;
        break;
      case "America/Cayman":
        timezone = TimeZone.America_Cayman;
        break;
      case "America/Puerto_Rico":
        timezone = TimeZone.America_Puerto_Rico;
        break;
      case "America/Miquelon":
        timezone = TimeZone.America_Miquelon;
        break;
      case "America/Grand_Turk":
        timezone = TimeZone.America_Grand_Turk;
        break;
      case "US/Pacific-New":
        timezone = TimeZone.US_Pacific_New;
        break;
      case "America/Argentina/Buenos_Aires":
        timezone = TimeZone.America_Argentina_Buenos_Aires;
        break;
      case "America/Argentina/Cordoba":
        timezone = TimeZone.America_Argentina_Cordoba;
        break;
      case "America/Argentina/Salta":
        timezone = TimeZone.America_Argentina_Salta;
        break;
      case "America/Argentina/Tucuman":
        timezone = TimeZone.America_Argentina_Tucuman;
        break;
      case "America/Argentina/La_Rioja":
        timezone = TimeZone.America_Argentina_La_Rioja;
        break;
      case "America/Argentina/San_Juan":
        timezone = TimeZone.America_Argentina_San_Juan;
        break;
      case "America/Argentina/Jujuy":
        timezone = TimeZone.America_Argentina_Jujuy;
        break;
      case "America/Argentina/Catamarca":
        timezone = TimeZone.America_Argentina_Catamarca;
        break;
      case "America/Argentina/Mendoza":
        timezone = TimeZone.America_Argentina_Mendoza;
        break;
      case "America/Argentina/San_Luis":
        timezone = TimeZone.America_Argentina_San_Luis;
        break;
      case "America/Argentina/Rio_Gallegos":
        timezone = TimeZone.America_Argentina_Rio_Gallegos;
        break;
      case "America/Argentina/Ushuaia":
        timezone = TimeZone.America_Argentina_Ushuaia;
        break;
      case "America/Aruba":
        timezone = TimeZone.America_Aruba;
        break;
      case "America/La_Paz":
        timezone = TimeZone.America_La_Paz;
        break;
      case "America/Noronha":
        timezone = TimeZone.America_Noronha;
        break;
      case "America/Belem":
        timezone = TimeZone.America_Belem;
        break;
      case "America/Santarem":
        timezone = TimeZone.America_Santarem;
        break;
      case "America/Fortaleza":
        timezone = TimeZone.America_Fortaleza;
        break;
      case "America/Recife":
        timezone = TimeZone.America_Recife;
        break;
      case "America/Araguaina":
        timezone = TimeZone.America_Araguaina;
        break;
      case "America/Maceio":
        timezone = TimeZone.America_Maceio;
        break;
      case "America/Bahia":
        timezone = TimeZone.America_Bahia;
        break;
      case "America/Sao_Paulo":
        timezone = TimeZone.America_Sao_Paulo;
        break;
      case "America/Campo_Grande":
        timezone = TimeZone.America_Campo_Grande;
        break;
      case "America/Cuiaba":
        timezone = TimeZone.America_Cuiaba;
        break;
      case "America/Porto_Velho":
        timezone = TimeZone.America_Porto_Velho;
        break;
      case "America/Boa_Vista":
        timezone = TimeZone.America_Boa_Vista;
        break;
      case "America/Manaus":
        timezone = TimeZone.America_Manaus;
        break;
      case "America/Eirunepe":
        timezone = TimeZone.America_Eirunepe;
        break;
      case "America/Rio_Branco":
        timezone = TimeZone.America_Rio_Branco;
        break;
      case "America/Santiago":
        timezone = TimeZone.America_Santiago;
        break;
      case "America/Punta_Arenas":
        timezone = TimeZone.America_Punta_Arenas;
        break;
      case "Pacific/Easter":
        timezone = TimeZone.Pacific_Easter;
        break;
      case "Antarctica/Palmer":
        timezone = TimeZone.Antarctica_Palmer;
        break;
      case "America/Bogota":
        timezone = TimeZone.America_Bogota;
        break;
      case "America/Curacao":
        timezone = TimeZone.America_Curacao;
        break;
      case "America/Lower_Princes":
        timezone = TimeZone.America_Lower_Princes;
        break;
      case "America/Kralendijk":
        timezone = TimeZone.America_Kralendijk;
        break;
      case "America/Guayaquil":
        timezone = TimeZone.America_Guayaquil;
        break;
      case "Pacific/Galapagos":
        timezone = TimeZone.Pacific_Galapagos;
        break;
      case "Atlantic/Stanley":
        timezone = TimeZone.Atlantic_Stanley;
        break;
      case "America/Cayenne":
        timezone = TimeZone.America_Cayenne;
        break;
      case "America/Guyana":
        timezone = TimeZone.America_Guyana;
        break;
      case "America/Asuncion":
        timezone = TimeZone.America_Asuncion;
        break;
      case "America/Lima":
        timezone = TimeZone.America_Lima;
        break;
      case "Atlantic/South_Georgia":
        timezone = TimeZone.Atlantic_South_Georgia;
        break;
      case "America/Paramaribo":
        timezone = TimeZone.America_Paramaribo;
        break;
      case "America/Port_of_Spain":
        timezone = TimeZone.America_Port_of_Spain;
        break;
      case "America/Anguilla":
        timezone = TimeZone.America_Anguilla;
        break;
      case "America/Antigua":
        timezone = TimeZone.America_Antigua;
        break;
      case "America/Dominica":
        timezone = TimeZone.America_Dominica;
        break;
      case "America/Grenada":
        timezone = TimeZone.America_Grenada;
        break;
      case "America/Guadeloupe":
        timezone = TimeZone.America_Guadeloupe;
        break;
      case "America/Marigot":
        timezone = TimeZone.America_Marigot;
        break;
      case "America/Montserrat":
        timezone = TimeZone.America_Montserrat;
        break;
      case "America/St_Barthelemy":
        timezone = TimeZone.America_St_Barthelemy;
        break;
      case "America/St_Kitts":
        timezone = TimeZone.America_St_Kitts;
        break;
      case "America/St_Lucia":
        timezone = TimeZone.America_St_Lucia;
        break;
      case "America/St_Thomas":
        timezone = TimeZone.America_St_Thomas;
        break;
      case "America/St_Vincent":
        timezone = TimeZone.America_St_Vincent;
        break;
      case "America/Tortola":
        timezone = TimeZone.America_Tortola;
        break;
      case "America/Montevideo":
        timezone = TimeZone.America_Montevideo;
        break;
      case "America/Caracas":
        timezone = TimeZone.America_Caracas;
        break;
    }
    return {
      unit,
      timezone,
      nullable:
        this.nullable && this.nullable !== "false" ? true : false,
    };
  }

  /**
   * Returns field agg value.
   */
  private _getAgg(): undefined | AggType {
    if (!this.agg) {
      return undefined;
    } else {
      switch (this.agg) {
        case "none":
          return AggType.None;
        case "count":
          return AggType.Count;
        case "countDistinct":
          return AggType.CountDistinct;
        case "countDistinctApprox":
          return AggType.CountDistinctApprox;
        case "sum":
          return AggType.Sum;
        case "avg":
          return AggType.Avg;
        case "min":
          return AggType.Min;
        case "max":
          return AggType.Max;
        default:
          throw new Error("Unsupported `agg` attribute value.");
      }
    }
  }
}

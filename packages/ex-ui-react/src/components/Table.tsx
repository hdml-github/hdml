import * as React from "react";
import { useState, ChangeEvent } from "react";
import { createPortal } from "react-dom";
import { Field, FieldData } from "./Field";
import style from "./Table.scss";

type TableProps = {
  id: string;
  key: string;
  remove: (key: string) => void;
};

/**
 * `hdml-table` editor component.
 */
export function Table(props: TableProps): React.JSX.Element {
  /**
   * Table name state.
   */
  const [tableName, setTableName] = useState<string>("table_name");

  /**
   * Table type state.
   */
  const [tableType, setTableType] = useState<string>("table");

  /**
   * Table source state.
   */
  const [tableSource, setTableSource] = useState<string>(
    "`source`.`table`.`name`",
  );

  /**
   * Show table field modal state.
   */
  const [showTableFieldModal, setShowTableFieldModal] =
    useState(false);

  /**
   * Table fields state.
   */
  const [tableFields, setTableFields] = useState<FieldData[]>([]);

  /**
   * Name changed event listener.
   */
  function nameChanged(event: ChangeEvent): void {
    const input = event.target as unknown as EventTarget & {
      value: string;
    };
    setTableName(input.value);
  }

  /**
   * Type changed event listener.
   */
  function typeChanged(event: ChangeEvent): void {
    const input = event.target as unknown as EventTarget & {
      value: string;
    };
    setTableType(input.value);
  }

  /**
   * Source changed event listener.
   */
  function sourceChanged(event: ChangeEvent): void {
    const input = event.target as unknown as EventTarget & {
      value: string;
    };
    setTableSource(input.value);
  }

  return (
    <div className={[style["hdml"], style["col"]].join(" ")}>
      <hdml-table
        name={tableName}
        type={tableType}
        source={tableSource}
      >
        {/* Table configuration */}
        <table
          className={[style["table"], style["table-hover"]].join(" ")}
        >
          <thead>
            {/* Table name */}
            <tr>
              <label className={style["form-label"]}>
                Table:
                <input
                  className={[
                    style["form-control"],
                    style["table-name"],
                  ].join(" ")}
                  type="text"
                  placeholder="Table name input"
                  aria-label="Table name input"
                  defaultValue={tableName}
                  onChange={nameChanged}
                />
              </label>
              <button
                type="button"
                className={[style["btn-close"]].join(" ")}
                onClick={() => {
                  props.remove(props.id);
                }}
              ></button>
            </tr>

            {/* Table type */}
            <tr>
              <label className={style["form-label"]}>
                Type:
                <select
                  className={[
                    style["form-select"],
                    style["table-type"],
                  ].join(" ")}
                  defaultValue={tableType}
                  placeholder="Table type select"
                  aria-label="Table type select"
                  onChange={typeChanged}
                >
                  <option value="table">Table name</option>
                  <option value="query">SQL query</option>
                  {/* <option value="csv">CSV content</option>
                    <option value="json">JSON content</option> */}
                </select>
              </label>
            </tr>

            {/* Table source */}
            <tr>
              <label className={style["form-label"]}>
                {tableType === "table" ? "Source:" : "Query:"}
                {tableType === "table" ? (
                  <input
                    className={[
                      style["form-control"],
                      style["origin-name"],
                    ].join(" ")}
                    type="text"
                    placeholder="Table origin input"
                    aria-label="Table origin input"
                    defaultValue={tableSource}
                    onChange={sourceChanged}
                  />
                ) : (
                  <textarea
                    className={[
                      style["form-control"],
                      style["query"],
                    ].join(" ")}
                    rows={4}
                    cols={55}
                    placeholder="Table origin input"
                    aria-label="Table origin input"
                    defaultValue={`select * from ${tableSource}`}
                    onChange={sourceChanged}
                  />
                )}
              </label>
            </tr>

            {/* Controls */}
            <tr>
              <div>
                <button
                  type="button"
                  className={[
                    style["btn"],
                    style["btn-primary"],
                  ].join(" ")}
                  onClick={() => setShowTableFieldModal(true)}
                >
                  Add Field
                </button>
                {showTableFieldModal &&
                  createPortal(
                    <Field
                      add={(data: FieldData) => {
                        setShowTableFieldModal(false);
                        setTableFields([...tableFields, data]);
                      }}
                      close={() => {
                        setShowTableFieldModal(false);
                      }}
                    />,
                    document.body,
                  )}
              </div>
            </tr>
          </thead>
        </table>

        {/* Table fields */}
        {tableFields.length === 0 ? (
          ""
        ) : (
          <table
            className={[
              style["fields"],
              style["table"],
              style["table-hover"],
            ].join(" ")}
          >
            <thead>
              {/* Columns name */}
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Origin</th>
                <th scope="col">Type</th>
              </tr>
            </thead>
            <tbody>
              {tableFields.map((field) => (
                <tr>
                  <td>{field.name}</td>
                  <td>{field.origin}</td>
                  <td>{field.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </hdml-table>
    </div>
  );
}

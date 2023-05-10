import * as React from "react";
import { useState, ChangeEvent } from "react";
import style from "./Field.scss";

export type FieldData = {
  name: string;
  origin: string;
  type: null | string;
};

type FieldProps = {
  add: (data: FieldData) => void;
  close: () => void;
};

export function Field(props: FieldProps): React.JSX.Element {
  /**
   * Table name state.
   */
  const [fieldName, setFieldName] = useState<string>("field_name");

  /**
   * Table origin state.
   */
  const [fieldOrigin, setFieldOrigin] =
    useState<string>("field_name");

  /**
   * Table type state.
   */
  const [fieldType, setFieldType] = useState<null | string>(null);

  /**
   * Name changed event listener.
   */
  function nameChanged(event: ChangeEvent): void {
    const input = event.target as unknown as EventTarget & {
      value: string;
    };
    setFieldName(input.value);
  }

  /**
   * Origin changed event listener.
   */
  function originChanged(event: ChangeEvent): void {
    const input = event.target as unknown as EventTarget & {
      value: string;
    };
    setFieldOrigin(input.value);
  }

  /**
   * Type changed event listener.
   */
  function typeChanged(event: ChangeEvent): void {
    const input = event.target as unknown as EventTarget & {
      value: string;
    };
    setFieldType(input.value.length ? input.value : null);
  }

  return (
    <>
      {/* Modal */}
      <div
        className={[
          style["modal"],
          style["fade"],
          style["show"],
        ].join(" ")}
        style={{ display: "block" }}
        tabIndex={-1}
      >
        <div
          className={[
            style["modal-dialog"],
            style["modal-dialog-centered"],
          ].join(" ")}
        >
          <div className={[style["modal-content"]].join(" ")}>
            {/* Field header */}
            <div className={[style["modal-header"]].join(" ")}>
              <h5 className={[style["modal-title"]].join(" ")}>
                Setup Field
              </h5>
              <button
                type="button"
                className={[style["btn-close"]].join(" ")}
                onClick={props.close}
              ></button>
            </div>

            {/* Field configs */}
            <div className={[style["modal-body"]].join(" ")}>
              <table
                className={[
                  style["table"],
                  style["table-hover"],
                ].join(" ")}
              >
                <thead>
                  {/* Field name */}
                  <tr>
                    <label className={style["form-label"]}>
                      Table:
                      <input
                        className={[
                          style["form-control"],
                          style["field-name"],
                        ].join(" ")}
                        type="text"
                        placeholder="Field name input"
                        aria-label="Field name input"
                        defaultValue={fieldName}
                        onChange={nameChanged}
                      />
                    </label>
                  </tr>

                  {/* Field origin */}
                  <tr>
                    <label className={style["form-label"]}>
                      Table:
                      <input
                        className={[
                          style["form-control"],
                          style["field-origin"],
                        ].join(" ")}
                        type="text"
                        placeholder="Field origin input"
                        aria-label="Field origin input"
                        defaultValue={fieldOrigin}
                        onChange={originChanged}
                      />
                    </label>
                  </tr>

                  {/* Field type */}
                  <tr>
                    <label className={style["form-label"]}>
                      Type:
                      <select
                        className={[
                          style["form-select"],
                          style["field-type"],
                        ].join(" ")}
                        placeholder="Field type select"
                        aria-label="Field type select"
                        defaultValue={fieldType || ""}
                        onChange={typeChanged}
                      >
                        <option value="">N/A</option>
                        <option value="int-8">Int-8</option>
                        <option value="int-16">Int-16</option>
                        <option value="int-32">Int-32</option>
                        <option value="int-64">Int-64</option>
                        <option value="uint-8">Uint-8</option>
                        <option value="uint-16">Uint-16</option>
                        <option value="uint-32">Uint-32</option>
                        <option value="uint-64">Uint-64</option>
                        <option value="float-16">Float-16</option>
                        <option value="float-32">Float-32</option>
                        <option value="float-64">Float-64</option>
                        <option value="binary">Binary</option>
                        <option value="utf-8">Utf-8</option>
                        <option value="decimal">Decimal</option>
                        <option value="date">Date</option>
                        <option value="time">Time</option>
                        <option value="timestamp">Timestamp</option>
                      </select>
                    </label>
                  </tr>
                </thead>
              </table>
            </div>

            {/* Field controls */}
            <div className={[style["modal-footer"]].join(" ")}>
              <button
                type="button"
                className={[style["btn"], style["btn-danger"]].join(
                  " ",
                )}
                onClick={props.close}
              >
                Remove Field
              </button>
              <button
                type="button"
                className={[
                  style["btn"],
                  style["btn-secondary"],
                ].join(" ")}
                onClick={props.close}
              >
                Close
              </button>
              <button
                type="button"
                className={[style["btn"], style["btn-primary"]].join(
                  " ",
                )}
                onClick={() =>
                  props.add({
                    name: fieldName,
                    origin: fieldOrigin,
                    type: fieldType,
                  })
                }
              >
                Save Field
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background */}
      <div
        className={[
          style["modal-backdrop"],
          style["fade"],
          style["show"],
        ].join(" ")}
      ></div>
    </>
  );
}

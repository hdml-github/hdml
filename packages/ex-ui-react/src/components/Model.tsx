import * as React from "react";
import { useState, ChangeEvent } from "react";
import { Table } from "./Table";
import style from "./Model.scss";

/**
 * `hdml-model` editor component.
 */
export function Model(): React.JSX.Element {
  /**
   * Model name state.
   */
  const [modelName, setModelName] = useState<string>("model_name");

  /**
   * Unique counter state.
   */
  const [count, setCount] = useState(1);

  /**
   * Tables ids array state.
   */
  const [tables, setTables] = useState<string[]>([]);

  /**
   * Name changed event listener.
   */
  function nameChanged(event: ChangeEvent): void {
    const input = event.target as unknown as EventTarget & {
      value: string;
    };
    setModelName(input.value);
  }

  /**
   * Generates table id and adds it ot the tables ids array state.
   */
  function addTable(): void {
    const index = `key-${count}`;
    setTables([...tables, index]);
    setCount(count + 1);
  }

  /**
   * Removes specified id from the tables ids array.
   */
  function removeTable(key: string): void {
    setTables(tables.filter((val) => val !== key));
  }

  /**
   * TODO
   */
  function addJoin(): void {
    console.log("join");
  }

  return (
    <div className={[style["card"], style["mb-3"]].join(" ")}>
      {/* Header */}
      <div className={style["card-header"]}>
        <label className={style["form-label"]}>
          Model:
          <input
            className={[
              style["form-control"],
              style["model-name"],
            ].join(" ")}
            type="text"
            placeholder="Model name input"
            aria-label="Model name input"
            defaultValue={modelName}
            onChange={nameChanged}
          />
        </label>
      </div>

      {/* Content */}
      <div className={style["card-body"]}>
        <hdml-model name={modelName}>
          {/* Tables */}
          <div
            className={
              tables.length > 0
                ? [style["row"], style["row-cols-2"]].join(" ")
                : style["row"]
            }
          >
            {tables.length === 0 ? (
              <div className={style["no-tables"]}>
                Please add your Table/Join
              </div>
            ) : (
              tables.map((val) => (
                <Table key={val} id={val} remove={removeTable} />
              ))
            )}
          </div>

          {/* Joins */}
        </hdml-model>
      </div>

      {/* Footer */}
      <div className={[style["card-footer"]].join(" ")}>
        <div
          className={style["btn-group"]}
          role="group"
          aria-label="Buttons group"
        >
          <button
            type="button"
            className={[style["btn"], style["btn-primary"]].join(" ")}
            onClick={addTable}
          >
            Add Table
          </button>
          <button
            type="button"
            className={[style["btn"], style["btn-primary"]].join(" ")}
            onClick={addJoin}
            disabled={tables.length < 2}
          >
            Add Join
          </button>
        </div>
      </div>
    </div>
  );
}

import * as React from "react";
import { useState } from "react";
import { Model } from "./Model";
import style from "./Builder.scss";

export function Builder(): React.JSX.Element {
  const [modelExist, setModelExist] = useState<boolean>(false);

  function addModel(): void {
    setModelExist(true);
  }

  function removeModel(): void {
    setModelExist(false);
  }

  function addFrame(): void {
    console.log("frame");
  }

  return (
    <div className={[style["builder"], style["container"]].join(" ")}>
      {/* Card */}
      <div
        className={[
          style["card"],
          style["shadow-sm"],
          style["mb-3"],
        ].join(" ")}
      >
        {/* Header */}
        <div className={style["card-header"]}>
          <h4>Builder</h4>
        </div>

        {/* Content */}
        <div className={style["card-body"]}>
          {modelExist ? (
            <Model />
          ) : (
            <div className={style["no-model"]}>
              Please, add your Model/Frame.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={[style["card-footer"]].join(" ")}>
          <div
            className={style["btn-group"]}
            role="group"
            aria-label="Buttons group"
          >
            {/* Model button */}
            {!modelExist ? (
              <button
                type="button"
                className={[style["btn"], style["btn-primary"]].join(
                  " ",
                )}
                onClick={addModel}
              >
                Add model
              </button>
            ) : (
              <button
                type="button"
                className={[style["btn"], style["btn-danger"]].join(
                  " ",
                )}
                onClick={removeModel}
              >
                Remove Model
              </button>
            )}

            {/* Frame button */}
            <button
              type="button"
              className={[style["btn"], style["btn-primary"]].join(
                " ",
              )}
              onClick={addFrame}
              disabled={true}
            >
              Add Frame
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

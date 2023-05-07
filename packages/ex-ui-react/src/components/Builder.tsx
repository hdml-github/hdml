import * as React from "react";
import { Model } from "./Model";
import style from "./Builder.scss";

export function Builder(): React.JSX.Element {
  return (
    <div className={style.builder}>
      <h1>QueryBuilder</h1>
      <Model />
    </div>
  );
}

import { object } from "./object";

export async function hook(scope, window) {
  const connective = window.document.querySelector(
    "hdml-frame[name=query] > hdml-filter-by > hdml-connective",
  );
  if (connective) {
    const filter = window.document.createElement("hdml-filter");
    filter.setAttribute("type", "expr");
    filter.setAttribute("clause", `\`catalog\` != '${object.sub}'`);
    connective.appendChild(filter);
  }
}

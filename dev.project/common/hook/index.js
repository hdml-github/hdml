const object = require("./object");

module.exports = async function(scope, window) {
  const io = window.document.querySelector("hdml-io");
  const connective = window.document.querySelector(
    "hdml-frame[name=query] > hdml-filter-by > hdml-connective",
  );
  const filter = window.document.createElement("hdml-filter");
  filter.setAttribute("type", "expr");
  filter.setAttribute("clause", "`catalog` = '!!!'");
  connective.appendChild(filter);

  console.log(JSON.stringify(await io.toJSON(), undefined, 2));

  return Promise.resolve(Buffer.from("!!!"));
}

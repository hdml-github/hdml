/**
 * @param {Element} dom 
 * @param {*} scope 
 * @returns {Element}
 */
export function hook(dom, scope) {
  log(`Tenant ${HDML_TENANT_NAME} hook, scope = ${JSON.stringify(scope, undefined, 2)}`);

  const frame = /** @type {Element} */ dom.querySelector("hdml-frame[name='maang_stock_grouped']");
  if (frame && scope.years) {
    const conn = frame.querySelector("hdml-filter-by > hdml-connective");
    const filter = `<hdml-filter type="expr" clause="\`year\` in (${scope.years.join(", ")})"></hdml-filter>`;
    conn.insertAdjacentHTML("beforeend", filter);
  }
  return dom;
};

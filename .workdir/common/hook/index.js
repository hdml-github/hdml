/**
 * @param {Element} dom 
 * @param {*} scope 
 * @returns {Element}
 */
export function hook(dom, scope) {
  // log(`Tenant ${HDML_TENANT_NAME} hook, uid = ${scope.uid}`);

  /**
   * @type {Element}
   */
  // const mod = dom.querySelector("hdml-model[name='model']");
  // if (mod) {
  //   mod.remove();
  // }

  /**
   * @type {Element}
   */
  // const frm = dom.querySelector("hdml-frame[name='frame']");
  // if (frm) {
  //   frm.setAttribute("offset", "100");
  // }

  return dom;
};

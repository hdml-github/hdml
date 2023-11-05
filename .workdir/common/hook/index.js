export function hook(dom, scope) {
  // log(`Tenant ${HDML_TENANT_NAME} hook, uid = ${scope.uid}`);

  const elm = dom.querySelector("hdml-frame[name='frame']");
  if (elm) {
    elm.setAttribute("offset", "100");
  }
  return dom;
};

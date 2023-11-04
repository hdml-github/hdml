export function hook(dom, scope) {
  log(HDML_TENANT_NAME, scope.uid);
  
  const elm = dom.querySelector("hdml-model[name='model']");
  if (elm) {
    elm.setAttribute("name", "hooked_model");
  }
  return dom;
};

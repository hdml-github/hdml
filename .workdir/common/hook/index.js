export function hook(dom, scope) {
  log(HDML_TENANT_NAME, scope.uid);
  // log(fetch(OPEN_URL));
  
  // dom
  //   .querySelector("hdml-model[name='model']")
  //   .setAttribute("name", "patched_model");

  return dom;
};

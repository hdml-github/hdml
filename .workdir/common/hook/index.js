export function hook(dom) {
  log(HDML_TENANT_NAME);
  // log(fetch(OPEN_URL));
  
  dom
    .querySelector("hdml-model[name='model']")
    .setAttribute("name", "patched_model");

  return dom;
};

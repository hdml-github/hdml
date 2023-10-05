const object = require("./object");

module.exports = async function(scope, window) {
  console.log(scope);
  console.log(object);
  return Promise.resolve(Buffer.from("!!!"));
}

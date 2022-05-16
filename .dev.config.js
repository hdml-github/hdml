const fs = require('fs');
const path = require('path');
const tslib = require('tslib');
const { esbuildPlugin } = require("@web/dev-server-esbuild");
const { fromRollup } = require("@web/dev-server-rollup");
const rollupCommonjs = require('@rollup/plugin-commonjs');
const rollupInject = require('@rollup/plugin-inject');
const rollupJson = require('@rollup/plugin-json');

function getInjectedModules() {
  const inject = {};
  Object.keys(tslib).forEach((key) => {
    inject[key] = ["tslib", key];
  });
  return inject;
}

const commonjs = fromRollup(rollupCommonjs);
const inject = fromRollup(rollupInject);
const json = fromRollup(rollupJson);

module.exports = {
  debug: true,
  rootDir: ".",
  nodeResolve: {
    jsnext: true,
    browser: true,
  },
  plugins: [
    json(),
    esbuildPlugin({
      ts: true,
      tsconfig: "./tsconfig/esm.json",
    }),
    commonjs({
      include: /node_modules/,
    }),
    inject({
      exclude: 'node_modules/**',
      modules: getInjectedModules(),
    }),
  ],
};

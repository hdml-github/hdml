import * as path from "path";
import tslib from "tslib";
import commonjs from "@rollup/plugin-commonjs"
import inject from "@rollup/plugin-inject";
import json from "@rollup/plugin-json";
import { nodeResolve as resolve } from "@rollup/plugin-node-resolve";
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import sourcemaps from "rollup-plugin-sourcemaps";
import { terser } from "rollup-plugin-terser";

const root = process.cwd();
const pkg = require(path.resolve(root, './package.json'));
const name = pkg.name.split("@hdml/")[1];
const source = path.resolve(root, './esm');
const target = path.resolve(root, './bin');
const input = path.resolve(source, './index.js');
const min = path.resolve(target, `./${name}.min.js`);

function getInjectedModules() {
  const inject = {};
  Object.keys(tslib).forEach((key) => {
    inject[key] = ["tslib", key];
  });
  return inject;
}

export default {
  input,
  plugins: [
    replace({
      preventAssignment: true,
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    json(),
    resolve({
      jsnext: true,
    }),
    postcss({
      extract: false,
      modules: true,
      inject: true,
      use: "sass",
    }),
    commonjs({
      include: /node_modules/,
    }),
    inject({
      exclude: "node_modules/**",
      modules: getInjectedModules(),
    }),
    sourcemaps(),
  ],
  output: [{
    format: 'umd',
    name: `@hdml/${name}`,
    file: min,
    sourcemap: true,
    plugins: [
      terser(),
    ],
  }],
};

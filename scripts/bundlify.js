const fs = require('fs');
const path = require('path');
const tslib = require('tslib');
const { rollup } = require('rollup');
const rollupAlias = require('@rollup/plugin-alias');
const rollupInject = require('@rollup/plugin-inject');
const { nodeResolve } = require('@rollup/plugin-node-resolve');

const root = process.cwd();
const pkg = require(`${root}/package.json`);
const name = pkg.name.split('@hdml/')[1];
const source = `${root}/esm`;
const target = `${root}/bundle`;
const input = `${source}/index.js`;
const bundle = `${target}/${name}.js`;
const mapfile = `${bundle}.map`;

function getInjectedModules() {
  const inject = {};
  Object.keys(tslib).forEach((key) => {
    inject[key] = ["tslib", key];
  });
  return inject;
}
if (!fs.existsSync(target)) {
  fs.mkdirSync(target);
}
rollup({
  input,
  plugins: [
    nodeResolve({
      jsnext: true,
    }),
    rollupInject({
      exclude: 'node_modules/**',
      modules: getInjectedModules(),
    }),
  ],
}).then(function (bundle) {
  return bundle.generate({
    format: 'umd',
    name: `@hdml/${name}`,
    amd: { id: `@hdml/${name}` },
    sourcemap: true,
  });
}).then(function (res) {
  const result = res.output[0];
  result.code = `\n${
    result.code
  }\n//# sourceMappingURL=${
    path.basename(mapfile)
  }`;
  fs.writeFileSync(bundle, result.code);
  fs.writeFileSync(mapfile, JSON.stringify(result.map));
}).catch(function (err) {
  process.stderr.write(`${err.stack}\n`);
  process.exit(1);
});

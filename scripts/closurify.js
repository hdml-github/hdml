const fs = require('fs');
const path = require('path');
const google = require('google-closure-compiler');

const root = process.cwd();
const pkg = require(`${root}/package.json`);
const name = pkg.name.split('@hdml/')[1];
const source = `${root}/bundle`;
const target = `${root}/bundle`;
const bundle = `${source}/${name}.js`;
const bundlemap = `${bundle}.map`;
const closure = `${target}/${name}.min.js`;
const closuremap = `${closure}.map`;

const compilerFlags = {
  js: [ bundle ],
  source_map_input: `${bundle}|${bundlemap}`,
  js_output_file: closure,
  create_source_map: closuremap,
  source_map_include_content: true,
  language_in: 'ECMASCRIPT_NEXT',
  compilation_level: 'SIMPLE',
  rewrite_polyfills: false,
};
const compiler = new google.compiler(compilerFlags);
compiler.run((code, out, msg) => {
  if (code) {
    process.stderr.write(`${msg}\n`);
    process.exit(1);
  }
  process.stdout.write(msg);

  let content = fs.readFileSync(closure, 'utf8');
  content = `${
    content
  }\n//# sourceMappingURL=${
    path.basename(closuremap)
  }`;
  fs.writeFileSync(closure, content, 'utf8');
});

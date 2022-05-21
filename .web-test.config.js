const { playwrightLauncher } = require("@web/test-runner-playwright");
const { esbuildPlugin } = require("@web/dev-server-esbuild");

module.exports = {
  concurrency: 10,
  nodeResolve: {
    exportConditions: ["development"],
  },
  coverage: true,
  coverageConfig: {
    report: true,
    reportDir: "./coverage",
    // include: ["**/src/**/*.ts"],
    // exclude: ["**node_modules**"],
  },
  plugins: [
    esbuildPlugin({
      ts: true,
      tsconfig: "./tsconfig/esm.json",
    }),
  ],
  browserLogs: false,
  browsers: [
    playwrightLauncher({
      product: "chromium",
      headless: false,
      devtools: true,
    }),
    playwrightLauncher({
      product: "webkit",
      headless: false,
      devtools: true,
    }),
    playwrightLauncher({
      product: "firefox",
      headless: false,
      devtools: true,
    }),
  ],
}

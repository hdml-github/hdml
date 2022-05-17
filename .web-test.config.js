const { playwrightLauncher } = require("@web/test-runner-playwright");

module.exports = {
  concurrency: 10,
  nodeResolve: {
    exportConditions: ['development'],
  },
  coverage: true,
  coverageConfig: {
    report: true,
    reportDir: "./coverage"
  },
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

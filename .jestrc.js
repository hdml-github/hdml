module.exports = {
  verbose: true,
  preset: "ts-jest",
  testURL: "http://localhost:8888",
  testMatch: ["**/?(*.)+(test).+(js)"],
  transform: {
    "^.+\\.(js|mjs)$": "ts-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!\@?lit)",
  ],
  globals: {
    "ts-jest": {
      tsconfig: {
        allowJs: true,
      },
    },
  },
};

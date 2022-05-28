module.exports = {
  ignorePatterns: [
    "*.js",
    "*.d.ts",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "tst.json",
    tsconfigRootDir: "./tsconfig",
    ecmaFeatures: {
      impliedStrict: true
    }
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
    "plugin:prettier/recommended"
  ],
  plugins: ["filenames", "prettier"],
  rules: {
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/unbound-method": "off",
    "max-len": ["error", {
      "code": 70
    }],
    "prettier/prettier": ["error", {
      "printWidth": 70,
      "semi": true,
      "trailingComma": "all",
      "tabWidth": 2,
      "useTabs": false,
      "bracketSpacing": true,
      "arrowParens": "always"
    }]
  }
};
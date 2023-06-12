# @hdml/io.querier

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## Overview

The `@hdml/io.querier` module is a service that is designed to send a query to the SQL engine. Query results are converted to the `arrow.Table` format and stored in the cache for later reading.

## Packaging

`@hdml/io.querier` is written in `TypeScript` and compiled into `ESM` and `CommonJS`. It also provides `*.d.ts` types definitions.

## Supported Browsers and Platforms

The bundles we compile support `Node.js` and do not support any browser.
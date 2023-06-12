# @hdml/io.gateway

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## Overview

The `@hdml/io.gateway` module consists of two services designed to process incoming HTTP requests, such as session initialization, data requests, and others. Also, these services are responsible for some auxiliary operations, such as reading user data from disk, compiling user `hdml` files, and others.

## Packaging

`@hdml/io.querier` is written in `TypeScript` and compiled into `ESM` and `CommonJS`. It also provides `*.d.ts` types definitions.

## Supported Browsers and Platforms

The bundles we compile support `Node.js` and do not support any browser.
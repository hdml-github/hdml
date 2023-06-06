# @hdml/schema

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## Overview

`Flatbuffers` schemas that describe queries that `HDML` components could form, and some other network-specific stuff.

## Packaging

`@hdml/schema` is written in `Flatbuffers` and `TypeScript`, and compiled to `ESM` and `CommonJS` module formats and `UMD` bundle. It also provides `*.d.ts` types definitions.

## Supported Browsers and Platforms

The bundles we compile support `Node.js` and moderns browser (`Firefox`, `Chrome`, `Edge`, and `Safari`) and are tested via `playwright`. We do not support `Internet Explorer`.
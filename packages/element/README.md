# @hdml/element

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## Overview

Set of a basic `hdml` primitives that provides basic behaviour for all `hdml` elements and single point for the `hdml` extensibility:

* classes:
  * `UnifiedElement`;
  * `SerializableElement`;
  * `NamedElement`;
* types:
  * `ElementSchema`;
* schemas:
  * `serializableElementSchema`;
  * `namedElementSchema`;
* helper functions:
  * `getUid`;
  * `getElementByUid`.

This package also incapsulate `lit` and `ajv` libraries by providing a higher level abstractions.

## Packaging

`@hdml/element` is written in `TypeScript`, and compiled to `ESM` and `CommonJS` module formats and `UMD` bundle. It also provide `*.d.ts` types definitions.

## Supported Browsers and Platforms

The bundles we compile support moderns browser (`Firefox`, `Chrome`, `Edge`, and `Safari`) and tested via `playwright`. We do not support `Internet Explorer` and `Node`.
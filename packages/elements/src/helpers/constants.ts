/**
 * @fileoverview Declaration of the getSignature function.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { v1, v5 } from "uuid";

/**
 * Session signature symbol.
 */
export const signature = Symbol(v5(v1(), v1()).toString());

/**
 * `IoElement` name RegExp.
 */
export const IO_NAME_REGEXP =
  /^(?:[a-z])+[a-z0-9]*(?:[-_.][a-z0-9]+)*\.[a-z]{2,6}$/;

/**
 * `IoElement` host url RegExp.
 */
export const IO_HOST_REGEXP = /.*/;

/**
 * `IoElement` tenant RegExp.
 */
export const IO_TENANT_REGEXP =
  /^(?:[a-z])+[a-z0-9-_]*(?:[-_][a-z0-9]+)*$/;

/**
 * `IoElement` token RegExp.
 */
export const IO_TOKEN_REGEXP = /^([a-zA-Z0-9_.\-+/=]*)$/;

/**
 * `ModelElement` name RegExp.
 */
export const MODEL_NAME_REGEXP = /^[a-zA-Z0-9_]*$/;

/**
 * The `TableElement` `name` attribute RegExp.
 */
export const TABLE_NAME_REGEXP = /^[a-zA-Z0-9_]*$/;

/**
 * The `TableElement` `type` attribute RegExp.
 */
export const TABLE_TYPE_REGEXP = /^json|csv|table|query$/;

/**
 * The `TableElement` `source` attribute RegExp.
 */
export const TABLE_SOURCE_REGEXP = /.*/;

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Logger, LoggerService } from "@nestjs/common";

/**
 * `BaseLogger` class.
 */
export class BaseLogger extends Logger implements LoggerService {}

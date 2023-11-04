/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Logger as BaseLogger } from "@nestjs/common";
import { Threads } from "./Threads";

/**
 * Logger service.
 */
export class Logger extends BaseLogger {
  private _threads: Threads;

  /**
   * @constructor
   */
  public constructor(context: string, thread: Threads) {
    super(context, {
      timestamp: true,
    });
    this._threads = thread;
  }

  /**
   * Error log level, for reporting errors in the application.
   * Messages will only be printed with levels
   * `LogLevel.LOG_LEVEL_ERROR`, `LogLevel.LOG_LEVEL_WARN`,
   * `LogLevel.LOG_LEVEL_LOG`, `LogLevel.LOG_LEVEL_DEBUG` and
   * `LogLevel.LOG_LEVEL_VERBOSE`.
   * @override
   */
  public fatal(message: unknown, ...params: unknown[]): void {
    super.fatal.call(this, message, ...params);
  }

  /**
   * Error log level, for reporting errors in the application.
   * Messages will only be printed with levels
   * `LogLevel.LOG_LEVEL_ERROR`, `LogLevel.LOG_LEVEL_WARN`,
   * `LogLevel.LOG_LEVEL_LOG`, `LogLevel.LOG_LEVEL_DEBUG` and
   * `LogLevel.LOG_LEVEL_VERBOSE`.
   * @override
   */
  public error(message: unknown, ...params: unknown[]): void {
    super.error.call(this, message, ...params);
  }

  /**
   * Warning log level, for potential issues that should be noted.
   * Messages will only be printed with levels
   * `LogLevel.LOG_LEVEL_WARN`, `LogLevel.LOG_LEVEL_LOG`,
   * `LogLevel.LOG_LEVEL_DEBUG` and `LogLevel.LOG_LEVEL_VERBOSE`.
   * @override
   */
  public warn(message: unknown, ...params: unknown[]): void {
    super.warn.call(this, message, ...params);
  }

  /**
   * A special level for logging. Messages will only be printed with
   * levels `LogLevel.LOG_LEVEL_LOG`, `LogLevel.LOG_LEVEL_DEBUG` and
   * `LogLevel.LOG_LEVEL_VERBOSE`.
   * @override
   */
  public log(message: unknown, ...params: unknown[]): void {
    super.log.call(this, message, ...params);
  }

  /**
   * Debug log level, suitable for general debugging purposes.
   * Messages will only be printed with levels
   * `LogLevel.LOG_LEVEL_DEBUG` and `LogLevel.LOG_LEVEL_VERBOSE`.
   * @override
   */
  public debug(message: unknown, ...params: unknown[]): void {
    super.debug.call(this, message, ...params);
  }

  /**
   * The most verbose log level. Can be used for detailed debugging
   * information. Messages will only be printed with level
   * `LogLevel.LOG_LEVEL_VERBOSE`.
   * @override
   */
  public verbose(message: unknown, ...params: unknown[]): void {
    super.verbose.call(this, message, ...params);
  }
}

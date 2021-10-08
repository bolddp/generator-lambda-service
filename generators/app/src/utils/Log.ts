export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Logger that introduces LOG levels, a namespace (module) and a millisecond timestamp that can
 * be used to determine processing intervals. The timestamp is 5 digits long and resets every
 * 100 seconds.
 */
export class Log {
  /**
   * Indicates if the logging should run in dev mode, which will include a 5 digit timestamp
   * and the log level as part of the log message.
   */
  public static DevMode: boolean = false;

  public static LogLevel: LogLevel = LogLevel.INFO;

  module: string;

  private logLevelTexts: { [key: number]: string } = {
    0: 'DEBUG',
    1: 'INFO',
    2: 'WARN',
    3: 'ERROR',
  };

  constructor(module: string) {
    this.module = module;
  }

  private static get5DigitTick(): string {
    return `00000${Date.now() % 100000}`.slice(-5);
  }

  log(level: LogLevel, message: string) {
    const logLevelText = `${this.logLevelTexts[level]}  `.substr(0, 5);
    const consoleLogStr = Log.DevMode
      ? `${Log.get5DigitTick()}: ${logLevelText} [${this.module}] : ${message}`
      : `[${this.module}] : ${message}`;
    console.log(consoleLogStr); // eslint-disable-line no-console
  }

  debug(message: string) {
    if (Log.LogLevel <= LogLevel.DEBUG) {
      this.log(LogLevel.DEBUG, message);
    }
  }

  debugFn(fnc: () => string) {
    if (Log.LogLevel <= LogLevel.DEBUG) {
      this.log(LogLevel.DEBUG, fnc());
    }
  }

  info(message: string) {
    if (Log.LogLevel <= LogLevel.INFO) {
      this.log(LogLevel.INFO, message);
    }
  }

  warn(message: string) {
    if (Log.LogLevel <= LogLevel.WARN) {
      this.log(LogLevel.WARN, message);
    }
  }

  error(message: string) {
    if (Log.LogLevel <= LogLevel.ERROR) {
      this.log(LogLevel.ERROR, message);
    }
  }
}

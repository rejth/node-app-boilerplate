import { Logger } from 'tslog';

export class LoggerService {
  private readonly _logger: Logger;

  constructor() {
    this._logger = new Logger({
      displayInstanceName: false,
      displayLoggerName: false,
      displayFilePath: 'hidden',
      displayFunctionName: false,
    });
  };

  log(...args: unknown[]) {
    this._logger.info(...args);
  };

  error(...args: unknown[]) {
    this._logger.error(...args);
  };

  warn(...args: unknown[]) {
    this._logger.warn(...args);
  };
};
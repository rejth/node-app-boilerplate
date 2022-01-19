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

  public log(...args: unknown[]) {
    this._logger.info(...args);
  };

  public error(...args: unknown[]) {
    this._logger.error(...args);
  };

  public warn(...args: unknown[]) {
    this._logger.warn(...args);
  };
};
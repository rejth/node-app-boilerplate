import { injectable } from 'inversify';
import { Logger } from 'tslog';
import 'reflect-metadata';

import { ILoggerService } from './ILoggerService';

@injectable()
export class LoggerService implements ILoggerService {
  readonly logger: Logger;

  constructor() {
    this.logger = new Logger({
      displayInstanceName: false,
      displayLoggerName: false,
      displayFilePath: 'hidden',
      displayFunctionName: false,
    });
  };

  log(...args: unknown[]) {
    this.logger.info(...args);
  };

  error(...args: unknown[]) {
    this.logger.error(...args);
  };

  warn(...args: unknown[]) {
    this.logger.warn(...args);
  };
};
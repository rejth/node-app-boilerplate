import { inject, injectable } from "inversify";
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';

import { IConfigService } from "./IConfigService";
import { ILoggerService } from "../logger/ILoggerService";
import { TYPES } from "../types";

@injectable()
export class ConfigService implements IConfigService {
  private _config: DotenvParseOutput;

  constructor(@inject(TYPES.Logger) private _logger: ILoggerService) {
    const result: DotenvConfigOutput = config();

    if (result.error) {
      this._logger.error('[ConfigService]: Error while reading of .env file')
    } else {
      this._logger.log('[ConfigService]: Config is loaded')
      this._config = result.parsed as DotenvParseOutput;
    }
  }

  getConfig<T extends string | number>(key: string): T {
    return this._config[key] as T;
  }
}
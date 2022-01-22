import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import 'reflect-metadata';

import { TYPES } from "../types";
import { ILogger } from "../logger/ILogger";
import { IExeptionFilter } from "./IExeptionFilter";

import { HttpError } from "./http-error";

@injectable()
export class ExeptionFilter implements IExeptionFilter {
  constructor(@inject(TYPES.ILogger) private _logger: ILogger) { };

  catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpError) {
      this._logger.error(`[${err.context}] Ошибка ${err.statusCode}: ${err.message}`);
      res.status(err.statusCode).send({ err: err.message });
    } else {
      this._logger.error(`${err.message}`);
      res.status(500).send({ err: err.message });
    };
  };
};
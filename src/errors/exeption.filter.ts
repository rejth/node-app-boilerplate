import { Request, Response, NextFunction } from "express";

import { LoggerService } from "../logger/logger.service";
import { HttpError } from "./http-error";
import { IExeptionFilter } from "./IExeptionFilter";

export class ExeptionFilter implements IExeptionFilter {
  logger: LoggerService;

  constructor(logger: LoggerService) {
    this.logger = logger;
  };

  catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpError) {
      this.logger.error(`[${err.context}] Ошибка ${err.statusCode}: ${err.message}`);
      res.status(err.statusCode).send({ err: err.message });
    } else {
      this.logger.error(`${err.message}`);
      res.status(500).send({ err: err.message });
    };
  };
};
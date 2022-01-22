import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import 'reflect-metadata';

import { TYPES } from "../types";
import { IRoute } from "../common/IRoute";
import { ILogger } from "../logger/ILogger";

import { BaseController } from '../common/base.controller';
import { HttpError } from "../errors/http-error";

@injectable()
export class UserController extends BaseController {
  private readonly _routes: IRoute[] = [
    {
      path: '/login',
      method: 'post',
      callback: this.login,
    },
    {
      path: '/register',
      method: 'post',
      callback: this.register,
    }
  ];

  constructor(@inject(TYPES.ILogger) logger: ILogger) {
    super(logger);
    this.bindRoutes(this._routes);
  };

  login(req: Request, res: Response, next: NextFunction) {
    next(new HttpError(401, 'Authorization error', 'Login'));
  };

  register(req: Request, res: Response, next: NextFunction) {
    this.success(res, 'Register successful!');
  };
};

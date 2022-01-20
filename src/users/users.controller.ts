import { Request, Response, NextFunction } from "express";

import { IRoute } from "../common/IRoute";
import { BaseController } from '../common/base.controller';
import { LoggerService } from "../logger/logger.service";
import { HttpError } from "../errors/http-error";

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

  constructor(logger: LoggerService) {
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

import express, { Request, Response, NextFunction } from "express";

import { IRoute } from "../common/IRoute";
import { BaseController } from '../common/base.controller';
import { LoggerService } from "../logger/logger.service";

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

  public login(req: Request, res: Response, next: NextFunction) {
    return this.success(res, 'Login successful!');
  };

  public register(req: Request, res: Response, next: NextFunction) {
    return this.success(res, 'Register successful!');
  };
};

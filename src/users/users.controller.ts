import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import 'reflect-metadata';

import { TYPES } from "../types";
import { IRoute } from "../common/IRoute";
import { ILoggerService } from "../logger/ILoggerService";
import { IUserController } from "./IUserController";

import { BaseController } from '../common/base.controller';
import { HttpError } from "../errors/http-error";

@injectable()
export class UserController extends BaseController implements IUserController {
  readonly routes: IRoute[] = [
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

  constructor(@inject(TYPES.ILogger) logger: ILoggerService) {
    super(logger);
    this.bindRoutes(this.routes);
  }

  login(req: Request, res: Response, next: NextFunction): void {
    next(new HttpError(401, 'Authorization error', 'Login'));
  }

  register(req: Request, res: Response, next: NextFunction): void {
    this.success(res, 'Register successful!');
  }
}

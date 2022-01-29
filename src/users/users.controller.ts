import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import 'reflect-metadata';

import { TYPES } from "../types";
import { IControllerRoute } from "../common/interfaces/IControllerRoute";
import { ILoggerService } from "../logger/ILoggerService";
import { IUserController } from "./interfaces/IUserController";
import { IUserService } from "./interfaces/IUsersService";

import { ValidateMiddleware } from "../common/validate.middleware";
import { BaseController } from '../common/base.controller';
import { HttpError } from "../errors/http-error";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";

@injectable()
export class UserController extends BaseController implements IUserController {
  readonly routes: IControllerRoute[] = [
    {
      path: '/login',
      method: 'post',
      callback: this.login,
      middlewares: [],
    },
    {
      path: '/register',
      method: 'post',
      callback: this.register,
      middlewares: [new ValidateMiddleware(UserRegisterDto)],
    }
  ];

  constructor(
    @inject(TYPES.ILogger) private _logger: ILoggerService,
    @inject(TYPES.IUserService) private _userService: IUserService,
  ) {
    super(_logger);
    this.bindRoutes(this.routes);
  }

  login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
    next(new HttpError(401, 'Authorization error', 'Login'));
  }

  async register({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
    const result = await this._userService.createUser(body);

    if (!result) {
      return next(new HttpError(422, 'User already exists!'))
    }

    this.success(res, 'Register is successful!');
  }
}

import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { sign } from 'jsonwebtoken';
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
import { IConfigService } from "../config/IConfigService";

@injectable()
export class UserController extends BaseController implements IUserController {
  readonly routes: IControllerRoute[] = [
    {
      path: '/login',
      method: 'post',
      callback: this.login,
      middlewares: [new ValidateMiddleware(UserLoginDto)],
    },
    {
      path: '/register',
      method: 'post',
      callback: this.register,
      middlewares: [new ValidateMiddleware(UserRegisterDto)],
    },
    {
      path: '/info',
      method: 'get',
      callback: this.info,
      middlewares: [],
    }
  ];

  constructor(
    @inject(TYPES.IConfigService) private _configService: IConfigService,
    @inject(TYPES.ILogger) private _logger: ILoggerService,
    @inject(TYPES.IUserService) private _userService: IUserService,
  ) {
    super(_logger);
    this.bindRoutes(this.routes);
  }

  public async login({ body }: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
    const result = await this._userService.loginUser(body);
    if (!result) return next(new HttpError(401, 'Authorization error', 'Login'))

    const jwt = await this.signJWT(body.email, this._configService.getConfig('SECRET'));
    this.success(res, { jwt });
  }

  public async register({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
    const result = await this._userService.createUser(body);
    if (!result) return next(new HttpError(422, 'User already exists', 'Register'))

    this.success(res, 'Registration is successful');
  }

  public async info({ user }: Request, res: Response): Promise<void> {
    this.success(res, { email: user });
  }

  private signJWT(email: string, secret: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      sign({
        email,
        iat: Math.floor(Date.now() / 1000),
      }, 
      secret,
      { algorithm: 'HS256' },
      (e, token) => {
        if (e) reject(e);
        resolve(token as string);
      },
      )
    })
  }
}
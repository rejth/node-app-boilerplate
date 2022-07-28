import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { sign } from 'jsonwebtoken';

import { TYPES } from "../../types";
import { IControllerRoute } from "../../common/interfaces/IControllerRoute";
import { ILoggerService } from "../../logger/ILoggerService";
import { IUserController } from "./interfaces/IUserController";
import { IUserService } from "./interfaces/IUsersService";

import { ValidateMiddleware } from "../../common/middlewares/validate.middleware";
import { BaseController } from '../../common/base.controller';
import { AuthGuard } from "../../common/guards/auth.guard";

import { IConfigService } from "../../config/IConfigService";
import { HttpError } from "../../errors/http-error";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";

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
      middlewares: [new AuthGuard()],
    }
  ];

  constructor(
    @inject(TYPES.ConfigService) private _configService: IConfigService,
    @inject(TYPES.Logger) private _logger: ILoggerService,
    @inject(TYPES.UserService) private _userService: IUserService,
  ) {
    super(_logger);
    this.bindRoutes(this.routes);
  }

  public async login({ body }: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
    const result = await this._userService.loginUser(body);
    if (!result) return next(new HttpError(401, 'Authorization error', 'Login'))

    const jwt = await this.signJWT(body.email, this._configService.getConfig('SECRET'));
    this.success(res, { accessToken: jwt });
  }

  public async register({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
    const result = await this._userService.createUser(body);
    if (!result) return next(new HttpError(422, 'User already exists', 'Register'))

    this.success(res, result);
  }

  public async info({ email }: Request, res: Response, next: NextFunction): Promise<void> {
    const result = await this._userService.getUserInfo(email);
    if (!result) return next(new HttpError(401, 'Authorization error', 'Info'))

    this.success(res, result);
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
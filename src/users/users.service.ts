import { inject, injectable } from "inversify";
import { UserModel } from "@prisma/client";
import 'reflect-metadata';

import { TYPES } from "../types";
import { IUserService } from "./interfaces/IUsersService";
import { IConfigService } from "../config/IConfigService";
import { IUserRepository } from "./interfaces/IUserRepository";

import { User } from "./user.entity";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { ILoggerService } from "../logger/ILoggerService";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IConfigService) private _configService: IConfigService,
    @inject(TYPES.ILogger) private _logger: ILoggerService,
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
  ) {}

  async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
    const newUser = new User(email, name)
    const salt = this._configService.getConfig<string>('SALT');
    await newUser.setPassword(password, Number(salt));

    const existedUser = await this._userRepository.find(email);
    if (existedUser) return null;
    return this._userRepository.create(newUser);
  }

  async loginUser({ email, password }: UserLoginDto): Promise<boolean> {
    const existedUser = await this._userRepository.find(email);
    if (!existedUser) return false;

    const newUser = new User(existedUser.email, existedUser.name)
    return newUser.comparePasswords(password, existedUser.password, (e, isMatch) => {
      if (!e && isMatch) return true;
      if (!isMatch) {
        this._logger.error(`[UserService] Authorization error. Password doesn't match!`);
        return false;
      }
    });
  }
}
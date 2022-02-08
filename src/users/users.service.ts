import { inject, injectable } from "inversify";
import 'reflect-metadata';

import { IUserService } from "./interfaces/IUsersService";
import { IConfigService } from "../config/IConfigService";

import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";
import { TYPES } from "../types";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IConfigService) private _configService: IConfigService,
  ) {}

  async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
    const newUser = new User(email, name)
    const salt = this._configService.getConfig<string>('SALT');
    await newUser.setPassword(password, Number(salt));

    return null;
  }

  async validateUser(dto: UserLoginDto): Promise<boolean> {
    return true;
  }
}
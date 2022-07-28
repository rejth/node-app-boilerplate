import 'reflect-metadata';
import { Container } from "inversify"
import { UserModel } from "@prisma/client";

import { TYPES } from "../../types";
import { IConfigService } from "../../config/IConfigService";

import { IUserRepository } from "./interfaces/IUserRepository";
import { IUserService } from "./interfaces/IUsersService";
import { UserService } from "./users.service";
import { User } from "./user.entity";
import { UserRegisterDto } from "./dto/user-register.dto";

const ConfigServiceMock: IConfigService = {
  getConfig: jest.fn(),
}

const UsersRepositoryMock: IUserRepository = {
  create: jest.fn(),
  find: jest.fn(),
}

const container = new Container();
let configService: IConfigService;
let usersRepository: IUserRepository
let usersService: IUserService;

const user: UserRegisterDto = {
  name: "User",
  email: "new@mail.ru",
  password: "password_1"
}

beforeAll(() => {
  container.bind<IUserService>(TYPES.UserService).to(UserService);
  container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
  container.bind<IUserRepository>(TYPES.UserRepository).toConstantValue(UsersRepositoryMock);

  configService = container.get<IConfigService>(TYPES.ConfigService);
  usersRepository = container.get<IUserRepository>(TYPES.UserRepository);
  usersService = container.get<IUserService>(TYPES.UserService);
})

describe('User Service', () => {
  it('createUser', async () => {
    configService.getConfig = jest.fn().mockReturnValueOnce(1);
    usersRepository.create = jest.fn().mockImplementationOnce((user: User): UserModel => ({
      name: user.name, 
      email: user.email, 
      password: user.password,
      id: 1,
    }))

    const createdUser = await usersService.createUser(user)

    expect(createdUser?.id).toBe(1);
    expect(createdUser?.password).not.toBe('password_1');
    expect(createdUser).toEqual(expect.objectContaining({
      name: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
      id: expect.any(Number),
    }));
  })
})
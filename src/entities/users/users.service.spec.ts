import 'reflect-metadata';
import path from 'path';
import fs from 'fs/promises';
import { Container } from "inversify"
import { UserModel } from "@prisma/client";

import { TYPES } from "../../types";
import { IConfigService } from "../../config/IConfigService";

import { IUserRepository } from "./interfaces/IUserRepository";
import { IUserService } from "./interfaces/IUsersService";
import { UserService } from "./users.service";
import { User } from "./user.entity";
import { UserRegisterDto } from "./dto/user-register.dto";

const container = new Container();

let configService: IConfigService;
let usersRepository: IUserRepository
let usersService: IUserService;
let testUser: UserRegisterDto;

const getFixturePath = (filename: string): string => path.join(__dirname, '../../..', '__fixtures__', filename);
const readFile = (filename: string): Promise<string> => fs.readFile(getFixturePath(filename), 'utf-8');

const ConfigServiceMock: IConfigService = {
  getConfig: jest.fn(),
}

const UsersRepositoryMock: IUserRepository = {
  create: jest.fn(),
  find: jest.fn(),
}

beforeAll(async () => {
  container.bind<IUserService>(TYPES.UserService).to(UserService);
  container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
  container.bind<IUserRepository>(TYPES.UserRepository).toConstantValue(UsersRepositoryMock);

  configService = container.get<IConfigService>(TYPES.ConfigService);
  usersRepository = container.get<IUserRepository>(TYPES.UserRepository);
  usersService = container.get<IUserService>(TYPES.UserService);
  
  testUser = JSON.parse(await readFile('user.json'));
})

describe('User Service', () => {
  it('createUser', async () => {
    configService.getConfig = jest.fn().mockReturnValueOnce(1);
    usersRepository.create = jest.fn().mockImplementationOnce((user: User): UserModel => ({
      name: user.name, 
      email: user.email, 
      password: user.password,
      id: 1,
    }));

    const createdUser = await usersService.createUser(testUser);

    expect(createdUser?.id).toBe(1);
    expect(createdUser?.password).not.toBe('password_1');
    expect(createdUser).toEqual(expect.objectContaining({
      name: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
      id: expect.any(Number),
    }));
  });

  it('loginUser: correct credentials', async () => {
    configService.getConfig = jest.fn().mockReturnValueOnce(1);
    usersRepository.create = jest.fn().mockImplementationOnce((user: User): UserModel => ({
      name: user.name, 
      email: user.email, 
      password: user.password,
      id: 1,
    }));

    const createdUser = await usersService.createUser(testUser);
    usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

    const isValidUser = await usersService.loginUser({ 
      email: testUser.email, 
      password: testUser.password
    });
    
    expect(isValidUser).toBeTruthy();
  });

  it('loginUser: wrong credentials', async () => {
    configService.getConfig = jest.fn().mockReturnValueOnce(1);
    usersRepository.create = jest.fn().mockImplementationOnce((user: User): UserModel => ({
      name: user.name, 
      email: user.email, 
      password: user.password,
      id: 1,
    }));

    const createdUser = await usersService.createUser(testUser);
    usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

    const isValidUser = await usersService.loginUser({ 
      email: testUser.email, 
      password: 'wrong password'
    });
    
    expect(isValidUser).toBeFalsy();
  });

  it('loginUser: user does not exist', async () => {
    usersRepository.find = jest.fn().mockReturnValueOnce(null);
    const isValidUser = await usersService.loginUser({ 
      email: testUser.email, 
      password: testUser.password
    });
    
    expect(isValidUser).toBeFalsy();
  })
})
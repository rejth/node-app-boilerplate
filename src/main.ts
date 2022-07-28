import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from "inversify";

/** Interfaces */
import { TYPES } from "./types";
import { ILoggerService } from "./logger/ILoggerService";
import { IExeptionFilter } from "./errors/IExeptionFilter";
import { IUserController } from "./entities/users/interfaces/IUserController";
import { IUserService } from "./entities/users/interfaces/IUsersService";
import { IUserRepository } from "./entities/users/interfaces/IUserRepository";
import { IConfigService } from "./config/IConfigService";
import { IPrismaService } from './database/IPrismaService';

/** Utils */
import { ConfigService } from "./config/config.service";
import { PrismaService } from "./database/prisma.service";
import { ExeptionFilter } from "./errors/exeption.filter";
import { LoggerService } from "./logger/logger.service";

/** Entities */
import { UserController } from './entities/users/users.controller';
import { UserService } from "./entities/users/users.service";
import { UserRepository } from "./entities/users/users.repository";

import { App } from "./app";

export interface IBootstrapReturn {
  appContainer: Container;
  app: App;
}

  /** Inversion of control container */
export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<App>(TYPES.Application).to(App);
  bind<IUserController>(TYPES.UserController).to(UserController);
  bind<IUserService>(TYPES.UserService).to(UserService);
  bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
  bind<ILoggerService>(TYPES.Logger).to(LoggerService).inSingletonScope();
  bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
  bind<IPrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
  bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
});

async function bootstrap(): Promise<IBootstrapReturn> {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.Application);
  await app.init();

  return { app, appContainer };
}

export const boot = bootstrap();
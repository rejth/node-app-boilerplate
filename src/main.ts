import { Container, ContainerModule, interfaces } from "inversify";

// Interfaces
import { TYPES } from "./types";
import { ILoggerService } from "./logger/ILoggerService";
import { IExeptionFilter } from "./errors/IExeptionFilter";
import { IUserController } from "./users/interfaces/IUserController";
import { IUserService } from "./users/interfaces/IUsersService";
import { IUserRepository } from "./users/interfaces/IUserRepository";
import { IConfigService } from "./config/IConfigService";
import { IPrismaService } from './database/IPrismaService';

// Utils
import { ConfigService } from "./config/config.service";
import { PrismaService } from "./database/prisma.service";
import { ExeptionFilter } from "./errors/exeption.filter";
import { LoggerService } from "./logger/logger.service";

// Entities
import { UserController } from './users/users.controller';
import { UserService } from "./users/users.service";
import { UserRepository } from "./users/users.repository";

import { App } from "./app";

export interface IBootstrapReturn {
  appContainer: Container;
  app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<App>(TYPES.Application).to(App); // реализация DI через inversify
  bind<IUserController>(TYPES.IUserController).to(UserController);
  bind<IUserService>(TYPES.IUserService).to(UserService);
  bind<IExeptionFilter>(TYPES.IExeptionFilter).to(ExeptionFilter);
  bind<ILoggerService>(TYPES.ILogger).to(LoggerService).inSingletonScope();
  bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
  bind<IPrismaService>(TYPES.IPrismaService).to(PrismaService).inSingletonScope();
  bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
});

async function bootstrap(): Promise<IBootstrapReturn> {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.Application);
  await app.init();

  return { app, appContainer };
}

export const boot = bootstrap();
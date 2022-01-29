import { Container, ContainerModule, interfaces } from "inversify";

import { TYPES } from "./types";
import { ILoggerService } from "./logger/ILoggerService";
import { IExeptionFilter } from "./errors/IExeptionFilter";
import { IUserController } from "./users/interfaces/IUserController";

import { App } from "./app";
import { UserController } from './users/users.controller';
import { ExeptionFilter } from "./errors/exeption.filter";
import { LoggerService } from "./logger/logger.service";
import { IUserService } from "./users/interfaces/IUsersService";
import { UserService } from "./users/users.service";

export interface IBootstrapReturn {
  appContainer: Container;
  app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<App>(TYPES.Application).to(App); // реализация DI через inversify
  bind<IUserController>(TYPES.IUserController).to(UserController);
  bind<IUserService>(TYPES.IUserService).to(UserService);
  bind<IExeptionFilter>(TYPES.IExeptionFilter).to(ExeptionFilter);
  bind<ILoggerService>(TYPES.ILogger).to(LoggerService);
});

async function bootstrap(): Promise<IBootstrapReturn> {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.Application);
  await app.init();

  return { app, appContainer };
}

export const boot = bootstrap();
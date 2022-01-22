import { Container, ContainerModule, interfaces } from "inversify";

import { TYPES } from "./types";
import { ILoggerService } from "./logger/ILoggerService";
import { IExeptionFilter } from "./errors/IExeptionFilter";
import { IUserController } from "./users/IUserController";

import { App } from "./app";
import { UserController } from './users/users.controller';
import { ExeptionFilter } from "./errors/exeption.filter";
import { LoggerService } from "./logger/logger.service";

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<App>(TYPES.Application).to(App); // реализация DI через inversify
  bind<IUserController>(TYPES.IUserController).to(UserController);
  bind<IExeptionFilter>(TYPES.IExeptionFilter).to(ExeptionFilter);
  bind<ILoggerService>(TYPES.ILogger).to(LoggerService);
});

function bootstrap() {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.Application);
  app.init();

  return { app, appContainer };
};

export const { app, appContainer } = bootstrap();
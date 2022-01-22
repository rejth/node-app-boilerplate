import { Container } from "inversify";

import { TYPES } from "./types";
import { ILogger } from "./logger/ILogger";
import { IExeptionFilter } from "./errors/IExeptionFilter";

import { App } from "./app";
import { UserController } from './users/users.controller';
import { ExeptionFilter } from "./errors/exeption.filter";
import { LoggerService } from "./logger/logger.service";

const appContainer = new Container();

appContainer.bind<App>(TYPES.Application).to(App);
appContainer.bind<UserController>(TYPES.UserController).to(UserController);
appContainer.bind<IExeptionFilter>(TYPES.IExeptionFilter).to(ExeptionFilter);
appContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService);

const app = appContainer.get<App>(TYPES.Application);
app.init();

export { app, appContainer };
import express, { Express } from 'express';
import { Server } from 'http';

import { UserController } from './users/users.controller.js';
import { LoggerService } from "./logger/logger.service";
import { ExeptionFilter } from './errors/exeption.filter.js';

export class App {
  private readonly _app: Express;
  private readonly _port: number;
  private readonly _logger: LoggerService;
  private readonly _userController: UserController;
  private readonly _exeptionFilter: ExeptionFilter;
  server: Server;

  constructor(logger: LoggerService, userController: UserController, exeptionFilter: ExeptionFilter) {
    this._app = express();
    this._port = 8000;
    this._logger = logger;
    this._userController = userController;
    this._exeptionFilter = exeptionFilter;
  };

  useRoutes() {
    this._app.use('/users', this._userController.router);
  };

  useExeptionFilters() {
    this._app.use(this._exeptionFilter.catch.bind(this._exeptionFilter));
  };

  async init() {
    this.useRoutes();
    this.useExeptionFilters();
    this.server = this._app.listen(this._port);
    this._logger.log(`Сервер запущен на http://localhost:${this._port}`);
  };
};
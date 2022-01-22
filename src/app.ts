import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { Server } from 'http';
import 'reflect-metadata';

import { TYPES } from './types';
import { ILogger } from './logger/ILogger';
import { IExeptionFilter } from './errors/IExeptionFilter';

import { UserController } from './users/users.controller.js';

@injectable()
export class App { // добавление сервиса в IoC container
  private readonly _app: Express;
  private readonly _port: number;
  server: Server;

  constructor(
    @inject(TYPES.ILogger) private _logger: ILogger, // @inject импортирует в конструктор экзмепляр сервиса}
    @inject(TYPES.IExeptionFilter) private _exeptionFilter: IExeptionFilter,
    @inject(TYPES.UserController) private _userController: UserController,
  ) {
    this._app = express();
    this._port = 8000;
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
    this._logger.log(`Server starts up on port http://localhost:${this._port}`);
  };
};
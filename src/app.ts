import express, { Express } from 'express';
import { Server } from 'http';

import { UserController } from './users/users.controller.js';
import { LoggerService } from "./logger/logger.service";

export class App {
  private readonly _app: Express;
  private readonly _port: number;
  private readonly _logger: LoggerService;
  private readonly _userController: UserController;
  server: Server;

  constructor(logger: LoggerService, userController: UserController) {
    this._app = express();
    this._port = 8000;
    this._logger = logger;
    this._userController = userController;
  };

  public useRoutes() {
    this._app.use('/users', this._userController.router);
  };

  public async init() {
    this.useRoutes();
    this.server = this._app.listen(this._port);
    this._logger.log(`Сервер запущен на http://localhost:${this._port}`);
  };
};
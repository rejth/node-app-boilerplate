import express, { Express } from 'express';
import { Server } from 'http';
import { userRouter } from './users/users.js';
import { LoggerService } from "./logger/logger.service";

export class App {
  _app: Express;
  _server: Server;
  _port: number;
  _logger: LoggerService;

  constructor(logger: LoggerService) {
    this._app = express();
    this._port = 8000;
    this._logger = logger;
  };

  private useRoutes() {
    this._app.use('/users', userRouter);
  };

  public async init() {
    this.useRoutes();
    this._server = this._app.listen(this._port);
    this._logger.log(`Сервер запущен на http://localhost:${this._port}`);
  };
};
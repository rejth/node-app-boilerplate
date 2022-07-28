import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { Server } from 'http';
import { json } from 'body-parser';

import { TYPES } from './types';
import { ILoggerService } from './logger/ILoggerService';
import { IExeptionFilter } from './errors/IExeptionFilter';
import { AuthMiddleware } from './common/auth.middleware';
import { IUserController } from './users/interfaces/IUserController';
import { IConfigService } from './config/IConfigService';
import { IPrismaService } from './database/IPrismaService';


@injectable()
export class App {
  private readonly _app: Express;
  private readonly _port: number;
  server: Server;

  constructor(
    @inject(TYPES.ILogger) private _logger: ILoggerService, // @inject импортирует в конструктор экзмепляр сервиса
    @inject(TYPES.IExeptionFilter) private _exeptionFilter: IExeptionFilter,
    @inject(TYPES.IUserController) private _userController: IUserController,
    @inject(TYPES.IConfigService) private _configService: IConfigService,
    @inject(TYPES.IPrismaService) private _prismaService: IPrismaService,
  ) {
    this._app = express();
    this._port = 8000;
  }

  useMiddleware(): void {
    this._app.use(json());
    const authMiddleware = new AuthMiddleware(this._configService.getConfig<string>('SECRET'));
    this._app.use(authMiddleware.execute.bind(authMiddleware));
  }

  useRoutes(): void {
    this._app.use('/auth', this._userController.router);
  }

  useExeptionFilters(): void {
    this._app.use(this._exeptionFilter.catch.bind(this._exeptionFilter));
  }

  public async init(): Promise<void> {
    this.useMiddleware();
    this.useRoutes();
    this.useExeptionFilters();
    await this._prismaService.connect();

    this.server = this._app.listen(this._port);
    this._logger.log(`Server starts up on port http://localhost:${this._port}`);
  }
}
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { Server } from 'http';
import { json } from 'body-parser';

import { TYPES } from './types';
import { ILoggerService } from './logger/ILoggerService';
import { IExeptionFilter } from './errors/IExeptionFilter';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { IUserController } from './entities/users/interfaces/IUserController';
import { IConfigService } from './config/IConfigService';
import { IPrismaService } from './database/IPrismaService';


@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(
    @inject(TYPES.Logger) private _logger: ILoggerService, // @inject импортирует в конструктор экзмепляр сервиса
    @inject(TYPES.ExeptionFilter) private _exeptionFilter: IExeptionFilter,
    @inject(TYPES.UserController) private _userController: IUserController,
    @inject(TYPES.ConfigService) private _configService: IConfigService,
    @inject(TYPES.PrismaService) private _prismaService: IPrismaService,
  ) {
    this.app = express();
    this.port = 8000;
  }

  useMiddleware(): void {
    this.app.use(json());
    const authMiddleware = new AuthMiddleware(this._configService.getConfig<string>('SECRET'));
    this.app.use(authMiddleware.execute.bind(authMiddleware));
  }

  useRoutes(): void {
    this.app.use('/auth', this._userController.router);
  }

  useExeptionFilters(): void {
    this.app.use(this._exeptionFilter.catch.bind(this._exeptionFilter));
  }

  public async init(): Promise<void> {
    this.useMiddleware();
    this.useRoutes();
    this.useExeptionFilters();
    await this._prismaService.connect();

    this.server = this.app.listen(this.port);
    this._logger.log(`Server starts up on port http://localhost:${this.port}`);
  }

  public close(): void {
    this.server.close();
  }
}
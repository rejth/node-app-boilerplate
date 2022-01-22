import { Response, Router } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';

import { IRoute } from "./IRoute";
import { ILoggerService } from '../logger/ILoggerService';

@injectable()
export abstract class BaseController {
  private readonly _router: Router;

  constructor(private _loggerService: ILoggerService) {
    this._router = Router();
  };

  get router() {
    return this._router;
  };

  created(res: Response) {
    return res.sendStatus(201);
  };

  send<T>(res: Response, code: number, message: T) {
    res.type('application/json');
    return res.status(code).json(message);
  };

  success<T>(res: Response, message: T) {
    return this.send<T>(res, 200, message);
  };

  error<T>(res: Response, message: T) {
    return this.send<T>(res, 500, message);
  };

  protected bindRoutes(routes: IRoute[]) {
    for (const { path, method, callback } of routes) {
      this._loggerService.log(`[${method.toUpperCase()}] ${path}`);
      const routeHandler = callback.bind(this);
      this._router[method](path, routeHandler);
    };
  };
};

import { Response, Router } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';

import { ExpressReturnType, IRoute } from "./IRoute";
import { ILoggerService } from '../logger/ILoggerService';

@injectable()
export abstract class BaseController {
  private readonly _router: Router;

  constructor(private _loggerService: ILoggerService) {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  created(res: Response): ExpressReturnType {
    return res.sendStatus(201);
  }

  send<T>(res: Response, code: number, message: T): ExpressReturnType {
    res.type('application/json');
    return res.status(code).json(message);
  }

  success<T>(res: Response, message: T): ExpressReturnType {
    return this.send<T>(res, 200, message);
  }

  error<T>(res: Response, message: T): ExpressReturnType {
    return this.send<T>(res, 500, message);
  }

  protected bindRoutes(routes: IRoute[]): void {
    for (const { path, method, callback } of routes) {
      this._loggerService.log(`[${method.toUpperCase()}] ${path}`);
      const routeHandler = callback.bind(this);
      this._router[method](path, routeHandler);
    }
  }
}

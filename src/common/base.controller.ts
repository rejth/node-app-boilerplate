import { Response, Router } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';

import { ExpressReturnType, IControllerRoute } from "./interfaces/IControllerRoute";
import { IMiddleware } from './interfaces/IMiddleware';
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

  protected bindRoutes(routes: IControllerRoute[]): void {
    for (const route of routes) {
      this._loggerService.log(`[${route.method.toUpperCase()}] ${route.path}`);
      const middleware = (route.middlewares || []).map((item: IMiddleware) => item.execute.bind(item))
      const routeHandler = route.callback.bind(this);

      const pipeline = middleware && middleware.length
        ? [...middleware, routeHandler]
        : routeHandler;

      this._router[route.method](route.path, pipeline);
    }
  }
}

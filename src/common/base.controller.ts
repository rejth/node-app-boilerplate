import { Response, Router } from 'express';

import { IRoute } from "./IRoute";
import { LoggerService } from "../logger/logger.service";

// ! Абстрактный класс позволяет только наследование
export abstract class BaseController {
  private readonly _router: Router;

  constructor(private logger: LoggerService) {
    this._router = Router();
  };

  get router() {
    return this._router;
  };

  created(res: Response) {
    return res.sendStatus(201);
  }

  send<T>(res: Response, code: number, message: T) {
    res.type('application/json');
    return res.status(code).json(message);
  }

  success<T>(res: Response, message: T) {
    return this.send<T>(res, 200, message);
  }

  error<T>(res: Response, message: T) {
    return this.send<T>(res, 500, message);
  }

  // protected-метод нельзя вызвать из экземпляра класса, но можно из наследника класса
  // создаем слушатель роута вида:
  // express.Router.post('/login', (req, res) => {
  //   res.send('register');
  // });
  protected bindRoutes(routes: IRoute[]) {
    for (const { path, method, callback } of routes) {
      this.logger.log(`[${method.toUpperCase()}] ${path}`);
      const routeHandler = callback.bind(this);
      this._router[method](path, routeHandler);
    };
  };
};
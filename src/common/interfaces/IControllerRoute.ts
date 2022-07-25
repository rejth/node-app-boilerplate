import { Request, Response, NextFunction, Router } from "express";
import { IMiddleware } from "./IMiddleware";

export interface IControllerRoute {
  path: string; // for example, /login, /register, /home
  method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'put'>;
  callback: (req: Request, res: Response, next: NextFunction) => void; // callback for requested route
  middlewares?: IMiddleware[]; // middlewares for validation and other operations
}

export type ExpressReturnType = Response<any, Record<string, any>>;

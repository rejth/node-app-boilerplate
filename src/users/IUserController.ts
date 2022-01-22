import { Request, Response, NextFunction } from "express";

import { BaseController } from "../common/base.controller";
import { IRoute } from "../common/IRoute";

export interface IUserController extends BaseController {
  routes: IRoute[];
  login: (req: Request, res: Response, next: NextFunction) => void;
  register: (req: Request, res: Response, next: NextFunction) => void;
}
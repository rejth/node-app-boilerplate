import { Request, Response, NextFunction } from "express";

import { BaseController } from "../../common/base.controller";
import { IControllerRoute } from "../../common/interfaces/IControllerRoute";

export interface IUserController extends BaseController {
  routes: IControllerRoute[];
  login: (req: Request, res: Response, next: NextFunction) => void;
  register: (req: Request, res: Response, next: NextFunction) => void;
}
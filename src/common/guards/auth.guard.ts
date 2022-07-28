import { Request, Response, NextFunction } from "express";

import { IMiddleware } from "../interfaces/IMiddleware";

export class AuthGuard implements IMiddleware {
  public execute(req: Request, res: Response, next: NextFunction): void {
    if (req.email) return next();
    res.status(401).send({ error: 'You are not authorized'})
  }
}
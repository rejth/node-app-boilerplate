import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import 'reflect-metadata';

import { IMiddleware } from "./interfaces/IMiddleware";

export class AuthMiddleware implements IMiddleware {
  constructor(private _secret: string) {}

  private verifyToken(req: Request, accessToken: string, next: NextFunction): Promise<string> {
    return new Promise<string>((resolve) => {
      verify(accessToken, this._secret, (e, payload) => {
        if (e) {
          next();
        } else if (payload && typeof payload === 'object') {
          resolve(payload.email);
        }
      });
    })
  }

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.headers.authorization) next();

    if (req.headers.authorization) {
      const accessToken = req.headers.authorization.split(' ')[1];
      const data = await this.verifyToken(req, accessToken, next)
      if (data) {
        req.user = data;
        next();
      }
    }
  }
}
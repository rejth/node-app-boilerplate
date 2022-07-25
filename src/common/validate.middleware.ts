import { Request, Response, NextFunction } from "express";
import { ClassConstructor, plainToClass } from "class-transformer";
import { validate } from "class-validator";

import { IMiddleware } from "./interfaces/IMiddleware";

export class ValidateMiddleware implements IMiddleware {
  constructor(private _classToValidate: ClassConstructor<object>) {}

  public execute({ body }: Request, res: Response, next: NextFunction): void {
    const instance = plainToClass(this._classToValidate, body);

    validate(instance).then((errors) => {
      if (errors.length) {
        res.status(422).send(errors);
      } else {
        next();
      }
    })
  }
}
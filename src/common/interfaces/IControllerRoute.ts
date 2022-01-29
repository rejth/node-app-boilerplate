import { Request, Response, NextFunction, Router } from "express";
import { IMiddleware } from "./IMiddleware";

// ! Pick - утилитарный тип, который берет переданные в него значения и создает новый интерфейс на основе другого

export interface IControllerRoute {
  path: string; // например, /login, /register, /home
  // создаем интерфейс для http-метода на базе Router'а, который состоит только из переданных значений
  // при чем IDE уже на этапе компиляции скажет, если мы опечатались в одном из методов
  method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'put'>;
  callback: (req: Request, res: Response, next: NextFunction) => void; // колбэк на запрос по роуту
  middlewares?: IMiddleware[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;

import express, { Request, Response, NextFunction } from 'express';
import { userRouter } from './users/users.js';

const port = 8000;
const app = express();

// обработчик роутинга для всего приложения
app.use((req, res, next) => {
  console.log('Единая точка входа для всех нижестоящих запросов и роутеров');
  next();
});

app.get('/hello', (req, res) => {
  throw new Error('Error!');
});

// обработчик роутинга для сущности Users
app.use('/users', userRouter);

// обработчик ошибок, всегда должен быть в конце после всех use()
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.message);
  res.status(500).send(err.message);
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
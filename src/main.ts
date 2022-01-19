import { App } from "./app";
import { LoggerService } from "./logger/logger.service";
import { UserController } from './users/users.controller';

async function bootstrap() {
  const logger = new LoggerService();
  const userController = new UserController(logger);

  const app = new App(logger, userController); // простейший DI: внедрение в App через конструктор зависимость от другого сервиса
  await app.init();
};

bootstrap();

export { bootstrap };
import { App } from "./app";
import { ExeptionFilter } from "./errors/exeption.filter";
import { LoggerService } from "./logger/logger.service";
import { UserController } from './users/users.controller';

// ! DI (внедрение зависимостей - процесс предоставления внешней зависимости программному компоненту)
// ! DI позволяет избежать инстанциирования (new ()) сервисов в компоненте и использовать передачу извне для упрощения тестирования

async function bootstrap() {
  const logger = new LoggerService();
  const userController = new UserController(logger);
  const exeptionFilter = new ExeptionFilter(logger);

  // ! app - Composition Root - точка сбора всех зависимостей
  const app = new App(logger, userController, exeptionFilter); // простейший DI: внедрение в App через конструктор зависимость от другого сервиса
  await app.init();
};

bootstrap();

export { bootstrap };
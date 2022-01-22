import { App } from "./app";
import { ExeptionFilter } from "./errors/exeption.filter";
import { LoggerService } from "./logger/logger.service";
import { UserController } from './users/users.controller';

// TODO
// ! Паттерн:
// ! DI (внедрение зависимостей - процесс предоставления внешней зависимости программному компоненту)
// ! DI позволяет избежать инстанциирования (new ()) сервисов в компоненте и использовать передачу извне для упрощения тестирования

// ! Принципы:
// ! Inversion of Control (инверсия управления) - каждый компонент системы должен быть как можно более изолирован от других, не полагаясь
// ! в своей работе на другие детали конкретной реализации других компонентов

// ! Dependency inversion principle (инверсия зависимостей) - модули верхних уровней не должны зависеть от модулей нижних уровней
// ! Оба типа модулей зависесть от абстракций. Абстракции не должны зависеть от деталей. Детали должны завистеть от абстракций
// ! Необходимо завязывать классы не на конкретную реализацию, а на интерфейс

// ! Реализация: Inversion of Control Container (IoC Container)

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
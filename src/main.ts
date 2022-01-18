import { App } from "./app";
import { LoggerService } from "./logger/logger.service";

async function bootstrap() {
  const logger = new LoggerService();
  const app = new App(logger); // простейший DI: внедрение в App через конструктор зависимость от другого сервиса
  await app.init();
};

bootstrap();

export { bootstrap };
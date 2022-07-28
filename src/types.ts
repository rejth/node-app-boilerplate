export const TYPES = {
  Application: Symbol.for('Application'),
  
  /** Utils */
  ConfigService: Symbol.for('ConfigService'),
  Logger: Symbol.for('LoggerService '),
  PrismaService: Symbol.for('PrismaService'),
  ExeptionFilter: Symbol.for('ExeptionFilter'),

  /** Entities */
  UserService: Symbol.for('UserService'),
  UserController: Symbol.for('UserController'),
  UserRepository: Symbol.for('UserRepository'),
}
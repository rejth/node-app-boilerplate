export interface IConfigService {
  getConfig: <T extends string | number>(key: string) => T;
}
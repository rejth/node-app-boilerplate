import 'reflect-metadata';

function Injectable(key: string) {
  return (target: Function) => {
    Reflect.defineMetadata(key, 1, target);
    const meta = Reflect.getMetadata(key, target);
    console.log(meta);
  }
}

function Inject(key: string) {
  return (target: Function) => {
    const meta = Reflect.getMetadata(key, target);
    const instance = new meta();
    return instance;
  }
}

function Prop(target: Object, name: string) {
  Reflect.defineMetadata('key', 1, target);
  const meta = Reflect.getMetadata('key', target);
  console.log(meta);
}

@Injectable('C')
export class C {
  @Prop prop: number;
}

// @Injectable('D')
// export class D {
//   constructor(@Inject('C') c: C) { // сюда подставляется экземпляр C
//   }
// };
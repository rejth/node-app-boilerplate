// декоратор класса
function Component(id: number) {
  console.log('init Component');
  return (target: Function) => {
    console.log('run Component');
    target.prototype.id = id;
  };
};

// декоратор класса
function Logger() {
  console.log('init Logger');
  return (target: Function) => {
    console.log('run Logger');
  };
};

// декоратор метода класса
function Method(
  target: Object, // класс
  propertyKey: string, // имя метода
  propertyDescriptror: PropertyDescriptor
) {
  console.log('Method: ', propertyKey);
  propertyDescriptror.value = (...args: any[]) => {
    return args[0] * 10;
  }
};

// декоратор переменной класса
function Prop(
  target: Object, // класс
  propertyKey: string, // имя переменной
) {
  console.log('Prop: ', propertyKey);
  let value: number;

  const getter = () => {
    console.log('Get!');
    return value;
  }
  const setter = (newValue: number) => {
    console.log('Set!');
    value = newValue;
  }

  Object.defineProperty(target, propertyKey, {
    get: getter,
    set: setter,
  })
};

// декоратор параметра функции
function Param(
  target: Object, // класс
  propertyKey: string, // метод класса
  index: number, // индекс переменной, переданной в метод класса
) {
  console.log('Param propertyKey: ', propertyKey);
  console.log('Param index: ', index);
};

// тестируемый класс
@Logger()
@Component(1)
export class User {
  @Prop id: number;

  @Method
  updateId(@Param newId: number) {
    this.id = newId;
    return this.id;
  };
}

console.log(new User().id);
console.log(new User().updateId(2));
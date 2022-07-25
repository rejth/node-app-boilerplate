import { hash, compare } from 'bcryptjs';

export class User {
  private _password: string;

  constructor(
    private readonly _email: string,
    private readonly _name: string,
  ) {}

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get password(): string {
    return this._password;
  }

  public comparePasswords(pass: string, hash: string): Promise<boolean> {
    return compare(pass, hash)
  }

  public async setPassword(password: string, salt: number): Promise<void> {
    this._password = await hash(password, salt);
  }
}
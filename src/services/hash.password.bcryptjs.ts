import {compare, genSalt, hash} from 'bcryptjs';

export interface PasswordHasher<T = string> {
  hashPassword(password: T): Promise<T>;
  comparePassword(providePass: T, stroePass: T): Promise<boolean>;
}

export class BcryptHasher implements PasswordHasher<string> {
  constructor() {}
  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(password, salt);
  }

  async comparePassword(
    providePass: string,
    storedPass: string,
  ): Promise<boolean> {
    const passwrodMatched = await compare(providePass, storedPass);
    return passwrodMatched;
  }
}

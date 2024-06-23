import { Injectable } from '@nestjs/common';
import * as md5 from 'md5';

interface HashedPasswordResult {
  hashedPassword: string;
}
@Injectable()
export class PasswordService {
  constructor() {}

  validatePassword(password: string, hashedPassword: string): boolean {
    const testPassword = md5(password);
    return testPassword === hashedPassword;
  }

  async hashPassword(password: string): Promise<HashedPasswordResult> {
    const hashedPassword = md5(password);

    return {
      hashedPassword,
    };
  }
}

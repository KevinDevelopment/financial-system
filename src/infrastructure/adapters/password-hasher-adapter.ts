import argon2 from "argon2";
import { PasswordHasher } from "../../core/aplication/services";

export class PasswordHasherAdapter implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    return argon2.hash(plain);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, plain);
  }
}

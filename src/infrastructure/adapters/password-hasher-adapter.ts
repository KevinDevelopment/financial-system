import bcrypt from "bcrypt";
import { PasswordHasher } from "../../core/aplication/services";

export class PasswordHasherAdapter implements PasswordHasher {
	private readonly saltRounds = 12;

	async hash(plain: string): Promise<string> {
		return bcrypt.hash(plain, this.saltRounds);
	}

	async compare(plain: string, hash: string): Promise<boolean> {
		return bcrypt.compare(plain, hash);
	}
}

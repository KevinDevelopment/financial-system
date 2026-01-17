import { User } from "../../core/domain/entities/user";
import { UserRepository } from "../../core/application/repositories";

export class InMemoryUserAdapter implements UserRepository {
	private readonly databaseInMemory: Array<User> = [];

	async create(user: User): Promise<void> {
		this.databaseInMemory.push(user);
	}

	async findByEmail(email: string): Promise<User | null> {
		const userExistsByEmail = this.databaseInMemory.find(
			(user) => user.email.value === email,
		);
		if (!userExistsByEmail) return null;
		return userExistsByEmail;
	}
}

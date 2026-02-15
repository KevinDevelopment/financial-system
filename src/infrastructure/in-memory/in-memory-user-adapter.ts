import { User } from "../../core/domain/entities/user";
import { UserRepository } from "../../core/application/repositories";
import { PaginatedResult } from "../../core/application/shared";
import { UserProps } from "../../core/domain/props";

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

	async findById(id: bigint): Promise<User | null> {
		const userExistsById = this.databaseInMemory.find(
			(user) => user.id.value === id,
		);
		if (!userExistsById) return null;
		return userExistsById;
	}

	async getUsers(
		organizationId: bigint,
		page: number,
		perPage: number,
	): Promise<PaginatedResult<UserProps>> {
		const filtered = this.databaseInMemory.filter(
			(acc) => acc.organizationId.value === organizationId,
		);

		const total = filtered.length;

		const start = (page - 1) * perPage;
		const end = start + perPage;

		const paginated = filtered.slice(start, end);

		const data = paginated.map((user) => ({
			id: user.id.value,
			name: user.name.value,
			email: user.email.value,
			role: user.role.type,
			organizationId: user.organizationId.value,
		}));

		return {
			data,
			total,
		};
	}
}

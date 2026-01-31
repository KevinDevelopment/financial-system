import { RefreshTokenRepository } from "../../core/application/repositories";
import { RefreshToken } from "../../core/domain/entities/refresh-token";

export class InMemoryRefreshTokenAdapter implements RefreshTokenRepository {
	private readonly databaseInMemory: Array<RefreshToken> = [];

	async create(token: RefreshToken): Promise<void> {
		this.databaseInMemory.push(token);
	}

	async getTokenById(id: bigint): Promise<RefreshToken | null> {
		const tokenExistsById = this.databaseInMemory.find(
			(token) => token.id.value === id
		)
		if (!tokenExistsById) return null;
		return tokenExistsById;
	}
}

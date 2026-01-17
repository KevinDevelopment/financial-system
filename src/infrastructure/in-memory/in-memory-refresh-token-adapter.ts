import { RefreshTokenRepository } from "../../core/aplication/repositories";
import { RefreshToken } from "../../core/domain/entities/refresh-token";

export class InMemoryRefreshTokenAdapter implements RefreshTokenRepository {
	private readonly databaseInMemory: Array<RefreshToken> = [];

	async create(token: RefreshToken): Promise<void> {
		this.databaseInMemory.push(token);
	}
}

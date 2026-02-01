import { RefreshTokenRepository } from "../../core/application/repositories";
import { RefreshToken } from "../../core/domain/entities/refresh-token";

export class InMemoryRefreshTokenAdapter implements RefreshTokenRepository {
	private readonly databaseInMemory: Array<RefreshToken> = [];

	async create(token: RefreshToken): Promise<void> {
		this.databaseInMemory.push(token);
	}

	async getTokenById(id: bigint): Promise<RefreshToken | null> {
		const tokenExistsById = this.databaseInMemory.find(
			(token) => token.id.value === id,
		);
		if (!tokenExistsById) return null;
		return tokenExistsById;
	}

	async updateRevokedAt(id: bigint, revokedAt: Date): Promise<void> {
		const index = this.databaseInMemory.findIndex(
			(token) => token.id.value === id,
		);

		if (index === -1) return;

		const token = this.databaseInMemory[index];

		const revokedToken = RefreshToken.create({
			id: token.id.value,
			userId: token.userId.value,
			organizationId: token.organizationId.value,
			expiresAt: token.expiresAt,
			revokedAt,
		});

		this.databaseInMemory[index] = revokedToken;
	}
}

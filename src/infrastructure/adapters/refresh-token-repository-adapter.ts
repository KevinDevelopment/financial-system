import { prisma } from "../config";
import { RefreshTokenRepository } from "../../core/application/repositories";
import { RefreshToken } from "../../core/domain/entities/refresh-token";
import { refreshTokenMapper } from "../mappers";

export class RefreshTokenRepositoryAdapter implements RefreshTokenRepository {
	async create(token: RefreshToken): Promise<void> {
		const data = refreshTokenMapper.toPersistence(token);

		await prisma.refreshToken.create({
			data: {
				id: data.id,
				userId: data.userId,
				organizationId: data.organizationId,
				expiresAt: data.expiresAt,
				revokedAt: data.revokedAt,
			},
		});
	}

	async getTokenById(id: bigint): Promise<RefreshToken | null> {
		const refreshToken = await prisma.refreshToken.findUnique({
			where: { id },
		});

		if (!refreshToken) return null;
		return refreshTokenMapper.toDomain(refreshToken);
	}

	async updateRevokedAt(id: bigint, revokedAt: Date): Promise<void> {
		await prisma.refreshToken.update({
			where: { id },
			data: { revokedAt },
		});
	}
}

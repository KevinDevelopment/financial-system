import { prisma } from "../config";
import { RefreshTokenRepository } from "../../core/aplication/repositories";
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
}

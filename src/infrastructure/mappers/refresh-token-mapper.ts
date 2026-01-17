import { RefreshToken } from "../../core/domain/entities/refresh-token";

export const refreshTokenMapper = {
	toPersistence(token: RefreshToken) {
		return {
			id: token.id?.value,
			userId: token.userId.value,
			organizationId: token.organizationId.value,
			expiresAt: token.expiresAt,
			revokedAt: token.revokedAt ?? null,
		};
	},

	toDomain(row: any): RefreshToken {
		return RefreshToken.create({
			id: row.id,
			userId: row.userId,
			organizationId: row.organizationId,
			expiresAt: row.expiresAt,
			revokedAt: row.revokedAt ?? undefined,
		});
	},
};

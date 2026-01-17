export interface RefreshTokenProps {
	id?: bigint;
	userId: unknown;
	organizationId: unknown;
	expiresAt?: Date;
	revokedAt?: Date;
}

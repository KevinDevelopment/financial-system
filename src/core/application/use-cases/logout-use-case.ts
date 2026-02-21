import { RefreshTokenRepository } from "../repositories";
import { TokenType } from "../types";
import { TokenService, TokenCache } from "../services";
import { LogoutInputDto } from "../dto";

export class LogoutUseCase {
	constructor(
		private readonly refreshTokenRepository: RefreshTokenRepository,
		private readonly tokenService: TokenService,
		private readonly tokenCache: TokenCache, 
	) {}

	async perform(input: LogoutInputDto): Promise<void> {
		if (!input.refreshToken || typeof input.refreshToken !== "string") return;

		const payload = await this.verifyRefreshToken(input.refreshToken);
		const tokenId = payload.tokenId;
		const expiresAt = new Date(payload.exp * 1000);

		const tokenEntity = await this.refreshTokenRepository.getTokenById(tokenId);
		if (!tokenEntity || tokenEntity.isExpired() || tokenEntity.isRevoked())
			return;

		await this.refreshTokenRepository.updateRevokedAt(tokenId, new Date());
		await this.tokenCache.remove(tokenId);
	}

	private async verifyRefreshToken(
		token: string,
	): Promise<{ tokenId: bigint; exp: number }> {
		try {
			return await this.tokenService.verify<{ tokenId: bigint; exp: number }>(
				TokenType.REFRESH,
				token,
			);
		} catch {
			return { tokenId: 0n, exp: 0 }; 
		}
	}
}

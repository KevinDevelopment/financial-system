import { RefreshTokenRepository } from "../repositories";
import { TokenType } from "../types";
import { TokenService, TokenBlackList } from "../services";
import { LogoutInputDto } from "../dto";

export class LogoutUseCase {
    constructor(
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly tokenService: TokenService,
        private readonly tokenBlacklist: TokenBlackList
    ) { }

    async perform(input: LogoutInputDto): Promise<void> {
        if (!input.refreshToken) return;
        if (typeof input.refreshToken !== 'string') return;

        let payload: { tokenId: bigint, exp: number };
        try {
            payload = await this.tokenService.verify<{ tokenId: bigint, exp: number }>(
                TokenType.REFRESH,
                input.refreshToken
            );
        } catch {
            return;
        }
        const tokenId = payload.tokenId;
        const expiresAt = new Date(payload.exp * 1000);
        const tokenEntity = await this.refreshTokenRepository.getTokenById(tokenId);

        if (!tokenEntity) return;
        if (tokenEntity.isExpired() || tokenEntity.isRevoked()) return;

        await this.refreshTokenRepository.updateRevokedAt(tokenId, new Date());
        await this.tokenBlacklist.revoke(tokenId, expiresAt);
    }
}

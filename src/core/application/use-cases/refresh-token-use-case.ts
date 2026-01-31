import { RefreshTokenRepository, UserRepository } from "../repositories";
import { RefreshTokenInputDto, RefreshTokenOutputDto } from "../dto";
import { TokenService } from "../services";
import { TokenType } from "../types";
import { InvalidCredentialsError, MissingDataError } from "../../domain/errors";

export class RefreshTokenUseCase {
    constructor(
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService
    ) { }

    async perform(input: RefreshTokenInputDto): Promise<RefreshTokenOutputDto> {
        if (!input.refreshToken) {
            throw new MissingDataError("Refresh token é obrigatório para renovar sessão", 422)
        }

        if (typeof input.refreshToken !== 'string') {
            throw new InvalidCredentialsError("Refresh token inválido", 401);
        }

        let payload: { tokenId: bigint };
        try {
            payload = await this.tokenService.verify<{ tokenId: bigint }>(
                TokenType.REFRESH,
                input.refreshToken
            );
        } catch {
            throw new InvalidCredentialsError("Refresh token inválido ou expirado", 401);
        }
        const tokenId = payload.tokenId;

        const tokenEntity = await this.refreshTokenRepository.getTokenById(tokenId);

        if (!tokenEntity) {
            throw new InvalidCredentialsError("Refresh token inválido ou expirado", 401);
        }

        if (tokenEntity.isExpired() || tokenEntity.isRevoked()) {
            throw new InvalidCredentialsError("Refresh token expirado ou revogado", 401);
        }

        const user = await this.userRepository.findById(tokenEntity.userId.value);

        if (!user) {
            throw new InvalidCredentialsError("Usuário não encontrado", 401);
        }

        const accessToken = await this.tokenService.generate(TokenType.ACCESS, {
            sub: user.id.value,
            organizationId: user.organizationId.value,
            role: user.role.type,
        });

        return { accessToken }
    }
}
import { RefreshTokenRepository, UserRepository } from "../repositories";
import { RefreshTokenInputDto, RefreshTokenOutputDto } from "../dto";
import { TokenService, TokenBlackList } from "../services";
import { TokenType } from "../types";
import { InvalidCredentialsError, MissingDataError } from "../../domain/errors";

export class RefreshTokenUseCase {
    constructor(
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly tokenBlackList: TokenBlackList,
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService
    ) { }

    async perform(input: RefreshTokenInputDto): Promise<RefreshTokenOutputDto> {
        if (!input.refreshToken) {
            throw new MissingDataError("Refresh token é obrigatório para renovar sessão", 422)
        }

        if (typeof input.refreshToken !== 'string') {
            throw new InvalidCredentialsError("Credenciais inválidas ou expiradas", 401);
        }

        let payload: { tokenId: bigint };
        try {
            payload = await this.tokenService.verify<{ tokenId: bigint }>(
                TokenType.REFRESH,
                input.refreshToken
            );
        } catch {
            console.log("caiu no catch do verify");
            throw new InvalidCredentialsError("Credenciais inválidas ou expiradas", 401);
        }
        const tokenId = payload.tokenId;

        // 1️⃣ Verifica blacklist do Redis
        const tokenIsRevokedInMemory = await this.tokenBlackList.isRevoked(tokenId);

        if (tokenIsRevokedInMemory) {
            console.log(`[CACHE] Token ${tokenId.toString()} revogado no Redis`);
            throw new InvalidCredentialsError("Credenciais inválidas ou expiradas", 401);
        }

        // 2️⃣ Consulta no banco
        const tokenEntity = await this.refreshTokenRepository.getTokenById(tokenId);

        if (!tokenEntity || tokenEntity.isExpired() || tokenEntity.isRevoked()) {
            console.log(`[DB] Token ${tokenId.toString()} inválido ou revogado no banco`);
            throw new InvalidCredentialsError("Credenciais inválidas ou expiradas", 401);
        }

        console.log(`[DB] Token ${tokenId.toString()} válido no banco`);


        const user = await this.userRepository.findById(tokenEntity.userId.value);

        if (!user) {
            throw new InvalidCredentialsError("Credenciais inválidas ou expiradas", 401);
        }

        const accessToken = await this.tokenService.generate(TokenType.ACCESS, {
            sub: user.id.value,
            organizationId: user.organizationId.value,
            role: user.role.type,
        });

        return { accessToken }
    }
}
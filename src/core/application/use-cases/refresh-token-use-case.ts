import { RefreshTokenRepository, UserRepository } from "../repositories";
import { RefreshTokenInputDto, RefreshTokenOutputDto } from "../dto";
import { TokenService, TokenCache } from "../services";
import { TokenType } from "../types";
import { InvalidCredentialsError, MissingDataError } from "../../domain/errors";

export class RefreshTokenUseCase {
	constructor(
		private readonly refreshTokenRepository: RefreshTokenRepository,
		private readonly tokenCache: TokenCache,
		private readonly userRepository: UserRepository,
		private readonly tokenService: TokenService,
	) {}

	async perform(input: RefreshTokenInputDto): Promise<RefreshTokenOutputDto> {
		this.validateInput(input);

		const tokenId = await this.verifyRefreshToken(input.refreshToken);

		const tokenEntity = await this.getTokenFromCacheOrDb(tokenId);

		const user = await this.userRepository.findById(tokenEntity.userId.value);
		if (!user)
			throw new InvalidCredentialsError(
				"Credenciais inválidas ou expiradas",
				401,
			);

		const accessToken = await this.tokenService.generate(TokenType.ACCESS, {
			sub: user.id.value,
			organizationId: user.organizationId.value,
			role: user.role.type,
		});

		return { accessToken };
	}

	private validateInput(input: RefreshTokenInputDto) {
		if (!input.refreshToken) {
			throw new MissingDataError(
				"Refresh token é obrigatório para renovar sessão",
				422,
			);
		}
		if (typeof input.refreshToken !== "string") {
			throw new InvalidCredentialsError(
				"Credenciais inválidas ou expiradas",
				401,
			);
		}
	}

	private async verifyRefreshToken(token: string): Promise<bigint> {
		try {
			const payload = await this.tokenService.verify<{ tokenId: bigint }>(
				TokenType.REFRESH,
				token,
			);
			return payload.tokenId;
		} catch {
			throw new InvalidCredentialsError(
				"Credenciais inválidas ou expiradas",
				401,
			);
		}
	}

	private async getTokenFromCacheOrDb(tokenId: bigint) {
		const isValidInCache = await this.tokenCache.has(tokenId);
		if (isValidInCache) {
			console.log(`[CACHE] Token ${tokenId.toString()} válido no Redis`);
			return await this.refreshTokenRepository.getTokenById(tokenId);
		}

		const tokenEntity = await this.refreshTokenRepository.getTokenById(tokenId);
		if (!tokenEntity || tokenEntity.isExpired() || tokenEntity.isRevoked()) {
			console.log(`[DB] Token ${tokenId.toString()} inválido ou revogado`);
			throw new InvalidCredentialsError(
				"Credenciais inválidas ou expiradas",
				401,
			);
		}

		await this.tokenCache.add(tokenId, tokenEntity.expiresAt);
		console.log(`[DB] Token ${tokenId.toString()} válido, adicionado ao Redis`);
		return tokenEntity;
	}
}

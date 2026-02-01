import { UserRepository, RefreshTokenRepository } from "../repositories";
import { PasswordHasher, TokenService } from "../services";
import { AuthenticateUserInputDto, AuthenticateUserOutputDto } from "../dto";
import { MissingDataError, InvalidCredentialsError } from "../../domain/errors";
import { RefreshToken } from "../../domain/entities/refresh-token";
import { TokenType } from "../types";

export class AuthenticateUserUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly passwordComparer: PasswordHasher,
		private readonly tokenService: TokenService,
		private readonly refreshTokenRepository: RefreshTokenRepository,
	) {}

	async perform(
		input: AuthenticateUserInputDto,
	): Promise<AuthenticateUserOutputDto> {
		if (!input.email || !input.password) {
			throw new MissingDataError(
				"Email e senha são obrigatórios para fazer o login",
				400,
			);
		}

		const user = await this.userRepository.findByEmail(input.email.trim());

		if (!user || !user.passwordHash) {
			throw new InvalidCredentialsError("Credenciais inválidas", 401);
		}

		const isValid = await this.passwordComparer.compare(
			input.password,
			user.passwordHash.value,
		);

		if (!isValid) {
			throw new InvalidCredentialsError("Credenciais inválidas", 401);
		}

		const accessToken = await this.tokenService.generate(TokenType.ACCESS, {
			sub: user.id.value,
			organizationId: user.organizationId.value,
			role: user.role.type,
		});

		const refreshTokenEntity = RefreshToken.create({
			userId: user.id.value,
			organizationId: user.organizationId.value,
		});

		const refreshToken = await this.tokenService.generate(TokenType.REFRESH, {
			sub: user.id.value,
			tokenId: refreshTokenEntity.id.value,
			organizationId: user.organizationId.value,
		});

		await this.refreshTokenRepository.create(refreshTokenEntity);

		return {
			accessToken,
			refreshToken,
		};
	}
}

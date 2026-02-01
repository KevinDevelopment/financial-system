import { LogoutUseCase } from "../../core/application/use-cases";
import {
	RefreshTokenRepositoryAdapter,
	RedisTokenCache,
	TokenServiceAdapter,
} from "../../infrastructure/adapters";
import { AplicationError } from "../../core/domain/errors";
import { HttpRequest, HttpResponse } from "../ports";

export class LogoutController {
	private readonly logoutUseCase: LogoutUseCase;

	constructor(
		refreshTokenRepositoryAdapter = new RefreshTokenRepositoryAdapter(),
		tokenService = new TokenServiceAdapter(),
		redisTokenCache = new RedisTokenCache(),
	) {
		this.logoutUseCase = new LogoutUseCase(
			refreshTokenRepositoryAdapter,
			tokenService,
			redisTokenCache,
		);
	}

	async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			await this.logoutUseCase.perform({
				refreshToken: httpRequest.body.refreshToken,
			});

			return {
				code: 204,
				message: "Deslogado com sucesso",
			};
		} catch (error) {
			if (error instanceof AplicationError) {
				return {
					code: error?.status,
					message: error?.message,
				};
			}

			return {
				code: 500,
				message: "Houve um erro inesperado",
			};
		}
	}
}

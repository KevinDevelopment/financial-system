import { AuthenticateUserUseCase } from "../../core/application/use-cases";
import {
	UserRepositoryAdapter,
	PasswordHasherAdapter,
	TokenServiceAdapter,
	RefreshTokenRepositoryAdapter,
} from "../../infrastructure/adapters";
import { AplicationError } from "../../core/domain/errors";
import { HttpRequest, HttpResponse } from "../ports";

export class AuthenticateUserController {
	private readonly authenticateUserUseCase: AuthenticateUserUseCase;

	constructor(
		userRepositoryAdapter = new UserRepositoryAdapter(),
		passwordComparerAdapter = new PasswordHasherAdapter(),
		tokenServiceAdapter = new TokenServiceAdapter(),
		refreshTokenAdapter = new RefreshTokenRepositoryAdapter(),
	) {
		this.authenticateUserUseCase = new AuthenticateUserUseCase(
			userRepositoryAdapter,
			passwordComparerAdapter,
			tokenServiceAdapter,
			refreshTokenAdapter,
		);
	}

	async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const result = await this.authenticateUserUseCase.perform({
				email: httpRequest.body.email,
				password: httpRequest.body.password,
			});

			return {
				code: 201,
				message: "Usuário autenticado com sucesso",
				body: result,
			};
		} catch (error) {
			console.error(error);
			if (error instanceof AplicationError) {
				return {
					code: error.status,
					message: error.message,
				};
			}

			return {
				code: 500,
				message: "Houve um erro inesperado",
			};
		}
	}
}

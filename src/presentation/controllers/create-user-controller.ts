import { CreateUserUseCase } from "../../core/application/use-cases";
import {
	UserRepositoryAdapter,
	PasswordHasherAdapter,
} from "../../infrastructure/adapters";
import { AplicationError } from "../../core/domain/errors";
import { HttpRequest, HttpResponse } from "../ports";

export class CreateUserController {
	private readonly createUserUseCase: CreateUserUseCase;

	constructor(
		userRepositoryAdapter = new UserRepositoryAdapter(),
		passwordHasherAdapter = new PasswordHasherAdapter(),
	) {
		this.createUserUseCase = new CreateUserUseCase(
			userRepositoryAdapter,
			passwordHasherAdapter,
		);
	}

	async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const result = await this.createUserUseCase.perform({
				name: httpRequest.body.name,
				email: httpRequest.body.email,
				role: httpRequest.body.role,
				password: httpRequest.body.password,
				organizationId: httpRequest.tenant.organizationId
			});

			return {
				code: 201,
				message: "Usuário criado com sucesso",
				body: result,
			};
		} catch (error) {
			console.error(error);
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

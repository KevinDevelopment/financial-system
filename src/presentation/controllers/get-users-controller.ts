import { GetUsersUseCase } from "../../core/application/use-cases";
import {
	UserRepositoryAdapter,
	PaginationMetadataAdapter,
} from "../../infrastructure/adapters";
import { AplicationError } from "../../core/domain/errors";
import { HttpRequest, HttpResponse } from "../ports";

export class GetUsersController {
	private readonly getUsersUseCase: GetUsersUseCase;

	constructor(
		userRepositoryAdapter = new UserRepositoryAdapter(),
		paginationMetadataAdapter = new PaginationMetadataAdapter(),
	) {
		this.getUsersUseCase = new GetUsersUseCase(
			userRepositoryAdapter,
			paginationMetadataAdapter,
		);
	}

	async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const result = await this.getUsersUseCase.perform({
				organizationId: httpRequest.tenant.organizationId,
				page: +httpRequest.query.page,
				perPage: +httpRequest.query.perPage,
			});

			return {
				code: 200,
				message: "Usuários localizados com sucesso",
				body: result,
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

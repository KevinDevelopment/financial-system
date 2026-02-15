import { GetCategoriesUseCase } from "../../core/application/use-cases";
import {
	CategoryRepositoryAdapter,
	PaginationMetadataAdapter,
} from "../../infrastructure/adapters";
import { AplicationError } from "../../core/domain/errors";
import { HttpRequest, HttpResponse } from "../ports";

export class GetCategoriesController {
	private readonly getCategoriesUseCase: GetCategoriesUseCase;

	constructor(
		getCateroryRepositoryAdapter = new CategoryRepositoryAdapter(),
		paginationMetadataAdapter = new PaginationMetadataAdapter(),
	) {
		this.getCategoriesUseCase = new GetCategoriesUseCase(
			getCateroryRepositoryAdapter,
			paginationMetadataAdapter,
		);
	}

	async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const result = await this.getCategoriesUseCase.perform({
				organizationId: httpRequest.tenant.organizationId,
				page: +httpRequest.query.page,
				perPage: +httpRequest.query.perPage,
			});

			return {
				code: 200,
				message: "Categorias localizadas com sucesso",
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

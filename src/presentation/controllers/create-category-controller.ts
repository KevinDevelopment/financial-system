import { CreateCategoryUseCase } from "../../core/application/use-cases";
import { CategoryRepositoryAdapter } from "../../infrastructure/adapters";
import { AplicationError } from "../../core/domain/errors";
import { HttpRequest, HttpResponse } from "../ports";

export class CreateCategoryController {
	private readonly createCategoryUseCase: CreateCategoryUseCase;

	constructor(categoryRepositoryAdapter = new CategoryRepositoryAdapter()) {
		this.createCategoryUseCase = new CreateCategoryUseCase(
			categoryRepositoryAdapter,
		);
	}

	async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const result = await this.createCategoryUseCase.perform({
				name: httpRequest.body.name,
				color: httpRequest.body.color,
				organizationId: httpRequest.tenant.organizationId,
				description: httpRequest.body.description,
			});

			return {
				code: 201,
				message: "Categoria criada com sucesso",
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

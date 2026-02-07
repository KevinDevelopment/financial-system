import { GetAccountsUseCase } from "../../core/application/use-cases";
import { AccountRepositoryAdapter, PaginationMetadataAdapter } from "../../infrastructure/adapters";
import { AplicationError } from "../../core/domain/errors";
import { HttpRequest, HttpResponse } from "../ports";

export class GetAccountsController {
    private readonly getAccountsUseCase: GetAccountsUseCase;

    constructor(
        accountRepositoryAdapte = new AccountRepositoryAdapter(),
        paginationMetadataAdapter = new PaginationMetadataAdapter()
    ) {
        this.getAccountsUseCase = new GetAccountsUseCase(
            accountRepositoryAdapte,
            paginationMetadataAdapter
        )
    }

    async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const result = await this.getAccountsUseCase.perform({
                organizationId: httpRequest.tenant.organizationId,
                page: +httpRequest.query.page,
                perPage: +httpRequest.query.perPage
            });

            return {
                code: 200,
                message: "Contas localizadas com sucesso",
                body: result
            }
        } catch (error) {
            if (error instanceof AplicationError) {
                return {
                    code: error?.status,
                    message: error?.message
                }
            }

            return {
                code: 500,
                message: "Houve um erro inesperado"
            }
        }
    }
}
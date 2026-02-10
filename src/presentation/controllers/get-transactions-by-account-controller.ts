import { GetTransactionsByAccountUseCase } from "../../core/application/use-cases";
import { AccountRepositoryAdapter, TransactionRepositoryAdapter, PaginationMetadataAdapter } from "../../infrastructure/adapters";
import { AplicationError } from "../../core/domain/errors";
import { HttpRequest, HttpResponse } from "../ports";

export class GetTransactionsByAccountController {
    private readonly getTransactionsByAccountUseCase: GetTransactionsByAccountUseCase;

    constructor(
        accountRepository = new AccountRepositoryAdapter(),
        transactionRepository = new TransactionRepositoryAdapter(),
        paginationMetadataAdapter = new PaginationMetadataAdapter()
    ) {
        this.getTransactionsByAccountUseCase = new GetTransactionsByAccountUseCase(
            accountRepository,
            transactionRepository,
            paginationMetadataAdapter
        )
    }

    async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const result = await this.getTransactionsByAccountUseCase.Perform({
                accountId: httpRequest.params.accountId,
                page: +httpRequest.query.page,
                perPage: +httpRequest.query.perPage
            });

            return {
                code: 200,
                message: "Transações localizadas com sucesso",
                body: result
            }
        } catch (error) {
            console.error(error)
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
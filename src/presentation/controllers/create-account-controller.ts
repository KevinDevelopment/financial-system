import { CreateAccountUseCase } from "../../core/application/use-cases";
import { AccountRepositoryAdapter } from "../../infrastructure/adapters";
import { AplicationError } from "../../core/domain/errors";
import { HttpResponse, HttpRequest } from "../ports";

export class CreateAccountController {
    private readonly createAccountUseCase: CreateAccountUseCase;

    constructor(accountRepositoryAdapter = new AccountRepositoryAdapter()) {
        this.createAccountUseCase = new CreateAccountUseCase(
            accountRepositoryAdapter
        )
    }

    async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { id } = await this.createAccountUseCase.perform({
                name: httpRequest.body.name,
                type: httpRequest.body.type,
                initialBalance: httpRequest.body.initialBalance,
                currentBalance: httpRequest.body.currentBalance,
                organizationId: httpRequest.body.organizationId,
                userId: httpRequest.body.userId
            });

            return {
                code: 201,
                message: "Conta cadastrada com sucesso",
                body: id
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
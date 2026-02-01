import { CreateTransactionUseCase } from "../../core/application/use-cases";
import {
	TransactionRepositoryAdapter,
	AccountRepositoryAdapter,
} from "../../infrastructure/adapters";
import { AplicationError } from "../../core/domain/errors";
import { HttpRequest, HttpResponse } from "../ports";

export class CreateTransactionController {
	private readonly createTransactionUseCase: CreateTransactionUseCase;

	constructor(
		accountRepositoryAdapter = new AccountRepositoryAdapter(),
		transactionRepositoryAdapter = new TransactionRepositoryAdapter(),
	) {
		this.createTransactionUseCase = new CreateTransactionUseCase(
			accountRepositoryAdapter,
			transactionRepositoryAdapter,
		);
	}

	async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const { id } = await this.createTransactionUseCase.perform({
				accountId: httpRequest.params.accountId,
				amount: httpRequest.body.amount,
				status: httpRequest.body.status,
				type: httpRequest.body.type,
				paymentMethod: httpRequest.body.paymentMethod,
				description: httpRequest.body.description,
				userId: httpRequest.body.userId,
				categoryId: httpRequest.body.categoryId,
			});

			return {
				code: 201,
				message: "Transação criada com sucesso",
				body: id,
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

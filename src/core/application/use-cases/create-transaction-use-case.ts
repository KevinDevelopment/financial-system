import { TransactionRepository, AccountRepository } from "../repositories";
import { CreateTransactionInputDto, CreateTransactionOutputDto } from "../dto";
import { DataAlreadyExistsError, MissingDataError } from "../../domain/errors";

export class CreateTransactionUseCase {
	constructor(
		private readonly accountRepository: AccountRepository,
		private readonly transactionRepository: TransactionRepository,
	) { }

	async perform(
		input: CreateTransactionInputDto,
	): Promise<CreateTransactionOutputDto> {
		if (!input.accountId) {
			throw new MissingDataError("Obrigatório informar a conta", 400);
		}

		const accountExists = await this.accountRepository.findById(
			input.accountId,
		);

		if (!accountExists) {
			throw new MissingDataError("Conta não encontrada", 400);
		}

		const transaction = accountExists.createTransaction({
			amount: input.amount,
			type: input.type,
			status: input.status,
			paymentMethod: input.paymentMethod,
			categoryId: input.categoryId,
			description: input.description,
		});

		const transactionAlreadyExists =
			await this.transactionRepository.findByUserAndDescriptionAndDate(
				input.userId,
				input.description,
				transaction.createdAt,
			);

		if (transactionAlreadyExists) {
			throw new DataAlreadyExistsError("Transação já cadastrada", 409);
		}

		//pode causar dados inconsistentes se uma das operações falhar
		// usar uma transação de banco de dados para garantir atomicidade
		// o pattern Unit of Work pode ser uma boa opção para gerenciar isso
		await this.transactionRepository.create(transaction);
		await this.accountRepository.update(accountExists);

		return {
			id: transaction.id.value,
		};
	}
}

import { TransactionRepository, AccountRepository } from "../repositories";
import {
	GetTransactionsByAccountInputDto,
	GetTransactionsByAccountOutputDto,
} from "../dto";
import { PaginationMetadataBuilder } from "../services";
import { MissingDataError, UnauthorizedError } from "../../domain/errors";
import { TransactionPolicy } from "../policies";

export class GetTransactionsByAccountUseCase {
	constructor(
		private readonly accountRepository: AccountRepository,
		private readonly transactionRepository: TransactionRepository,
		private readonly paginationMetadataBuilder: PaginationMetadataBuilder,
	) {}

	async Perform(
		input: GetTransactionsByAccountInputDto,
	): Promise<GetTransactionsByAccountOutputDto> {
		if (!TransactionPolicy.canView(input.auth)) {
			throw new UnauthorizedError("Permissão negada", 403);
		}

		const { accountId } = input;
		const page = input.page ? input.page : 1;
		const perPage = input.perPage ? input.perPage : 50;

		if (!accountId) {
			throw new MissingDataError("Necessário informar id da conta", 422);
		}

		const accountExists = await this.accountRepository.findById(accountId);

		if (!accountExists) {
			throw new MissingDataError("Conta informada não existe", 400);
		}

		if (accountExists.organizationId.value !== input.auth.organizationId) {
			throw new UnauthorizedError("Permissão negada", 403);
		}

		const result = await this.transactionRepository.getByAccount(
			accountId,
			page,
			perPage,
		);

		const metadata = this.paginationMetadataBuilder.build({
			page,
			perPage,
			total: result.total,
			count: result.data.length,
		});

		return {
			transactions: result.data,
			metadata,
		};
	}
}

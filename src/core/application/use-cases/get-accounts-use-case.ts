import { AccountRepository } from "../repositories";
import { GetAccountsInputDto, GetAccountsOutputDto } from "../dto";
import { PaginationMetadataBuilder } from "../services";

export class GetAccountsUseCase {
	constructor(
		private readonly accountRepository: AccountRepository,
		private readonly paginationMetadataBuilder: PaginationMetadataBuilder,
	) {}

	async perform(input: GetAccountsInputDto): Promise<GetAccountsOutputDto> {
		const { organizationId } = input;
		const page = input.page ? input.page : 1;
		const perPage = input.perPage ? input.perPage : 50;

		const result = await this.accountRepository.getAccounts(
			organizationId,
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
			accounts: result.data,
			metadata,
		};
	}
}

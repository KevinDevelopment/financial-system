import { UserRepository } from "../repositories";
import { GetUsersInputDto, GetUsersOutputDto } from "../dto";
import { PaginationMetadataBuilder } from "../services";

export class GetUsersUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly paginationMetadataBuilder: PaginationMetadataBuilder,
	) {}

	async perform(input: GetUsersInputDto): Promise<GetUsersOutputDto> {
		const { organizationId } = input;
		const page = input.page ? input.page : 1;
		const perPage = input.perPage ? input.perPage : 50;

		const result = await this.userRepository.getUsers(
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
			users: result.data,
			metadata,
		};
	}
}

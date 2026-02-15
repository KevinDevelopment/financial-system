import { CategoryRepository } from "../repositories";
import { GetCategoriesInputDto, GetCategoriesOutputDto } from "../dto";
import { PaginationMetadataBuilder } from "../services";

export class GetCategoriesUseCase {
	constructor(
		private readonly categoryRepository: CategoryRepository,
		private readonly paginationMetadataBuilder: PaginationMetadataBuilder,
	) {}

	async perform(input: GetCategoriesInputDto): Promise<GetCategoriesOutputDto> {
		const { organizationId } = input;
		const page = input.page ? input.page : 1;
		const perPage = input.perPage ? input.perPage : 50;

		const result = await this.categoryRepository.getCategories(
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
			categories: result.data,
			metadata,
		};
	}
}

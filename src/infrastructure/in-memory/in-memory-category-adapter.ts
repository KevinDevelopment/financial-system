import { Category } from "../../core/domain/entities/category";
import { CategoryRepository } from "../../core/application/repositories";
import { PaginatedResult } from "../../core/application/shared";
import { CategoryProps } from "../../core/domain/props";

export class InMemoryCategoryAdapter implements CategoryRepository {
	private readonly databaseInMemory: Array<Category> = [];

	async create(category: Category): Promise<void> {
		this.databaseInMemory.push(category);
	}

	async findByName(name: string): Promise<Category | null> {
		const categoryExistsByName = this.databaseInMemory.find(
			(cat) => cat.name.value === name,
		);
		if (!categoryExistsByName) return null;
		return categoryExistsByName;
	}

	async getCategories(
		organizationId: bigint,
		page?: number,
		perPage?: number,
	): Promise<PaginatedResult<CategoryProps>> {
		const filtered = this.databaseInMemory.filter(
			(acc) => acc.organizationId.value === organizationId,
		);

		const total = filtered.length;

		const start = (page - 1) * perPage;
		const end = start + perPage;

		const paginated = filtered.slice(start, end);

		const data = paginated.map((category) => ({
			id: category.id.value,
			name: category.name.value,
			color: category.color.value,
			description: category.description,
			organizationId: category.organizationId.value,
		}));

		return {
			data,
			total,
		};
	}
}

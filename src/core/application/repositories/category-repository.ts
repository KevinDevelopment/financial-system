import { Category } from "../../domain/entities/category";
import { CategoryProps } from "../../domain/props";
import { PaginatedResult } from "../shared";

export interface CategoryRepository {
	create(category: Category): Promise<void>;
	findByName(name: string, organizationId: bigint): Promise<Category | null>;
	getCategories(
		organizationId: bigint,
		page?: number,
		perPage?: number,
	): Promise<PaginatedResult<CategoryProps>>;
}

import { Category } from "../../domain/entities/category";

export interface CategoryRepository {
	create(category: Category): Promise<void>;
	findByName(name: string, organizationId: bigint): Promise<Category | null>;
}

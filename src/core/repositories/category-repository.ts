import { Category } from "../entities";

export interface CategoryRepository {
	create(category: Category, organizationId: bigint): Promise<void>;
	findByName(name: string, organizationId: bigint): Promise<Category | null>;
}

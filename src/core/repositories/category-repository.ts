import { Category } from "../entities";

export interface CategoryRepository {
	create(category: Category): Promise<void>;
	findByName(name: string, organizationId: bigint): Promise<Category | null>;
}

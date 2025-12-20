import { Category } from "../entities";

export interface CategoryRepository {
    create(category: Category): Promise<void>;
    findByName(name: string): Promise<Category | null>;
}
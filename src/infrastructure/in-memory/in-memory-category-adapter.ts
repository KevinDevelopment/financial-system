import { Category } from "../../core/entities";
import { CategoryRepository } from "../../core/repositories";

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
}
import { Category } from "../../core/entities";

export const categoryMapper = {
    toPersistence(category: Category) {
        return {
            id: category.id.value,
            name: category.name,
            color: category.color,
            description: category.description,
        };
    },

    toDomain(row: any): Category {
        return Category.create({
            id: row.id,
            name: row.name,
            color: row.color,
            description: row.description,
        });
    },
};
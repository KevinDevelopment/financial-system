import { Category } from "../../core/domain/entities/category";

export const categoryMapper = {
	toPersistence(category: Category) {
		return {
			id: category.id.value,
			name: category.name.value,
			color: category.color.value,
			organizationId: category.organizationId.value,
			description: category.description,
		};
	},

	toDomain(row: any): Category {
		return Category.create({
			id: row.id,
			name: row.name,
			color: row.color,
			organizationId: row.organizationId,
			description: row.description,
		});
	},
};

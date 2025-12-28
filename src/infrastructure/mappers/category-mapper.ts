import { Category } from "../../core/domain/entities";

export const categoryMapper = {
	toPersistence(category: Category) {
		return {
			id: category.id.value,
			name: category.name,
			color: category.color,
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

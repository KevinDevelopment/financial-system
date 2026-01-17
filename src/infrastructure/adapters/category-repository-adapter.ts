import { Category } from "../../core/domain/entities/category";
import { CategoryRepository } from "../../core/application/repositories";
import { prisma } from "../config";
import { categoryMapper } from "../mappers";

export class CategoryRepositoryAdapter implements CategoryRepository {
	public async create(category: Category): Promise<void> {
		const data = categoryMapper.toPersistence(category);

		await prisma.category.create({
			data: {
				id: data.id,
				name: data.name,
				color: data.color,
				...(data.description && { description: data.description }),
				organizationId: data.organizationId,
			},
		});
	}

	public async findByName(
		name: string,
		organizationId: bigint,
	): Promise<Category | null> {
		const category = await prisma.category.findFirst({
			where: {
				name,
				organizationId,
			},
		});

		if (!category) return null;

		return categoryMapper.toDomain(category);
	}
}

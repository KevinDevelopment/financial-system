import { Category } from "../../core/domain/entities/category";
import { CategoryRepository } from "../../core/application/repositories";
import { prisma } from "../config";
import { categoryMapper } from "../mappers";
import { PaginatedResult } from "../../core/application/shared";
import { CategoryProps } from "../../core/domain/props";

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

	async getCategories(
		organizationId: bigint,
		page?: number,
		perPage?: number,
	): Promise<PaginatedResult<CategoryProps>> {
		const skip = (page - 1) * perPage;

		const [categories, total] = await prisma.$transaction([
			prisma.category.findMany({
				where: { organizationId },
				skip,
				take: perPage,
				orderBy: { createdAt: "desc" },
			}),
			prisma.category.count({
				where: { organizationId },
			}),
		]);

		const data = categories.map((category) =>
			categoryMapper.toDomain(category).toProps(),
		);

		return {
			data,
			total,
		};
	}
}

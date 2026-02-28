import { User } from "../../core/domain/entities/user";
import { UserRepository } from "../../core/application/repositories";
import { prisma } from "../config";
import { userMapper } from "../mappers";
import { PaginatedResult } from "../../core/application/shared";
import { UserProps } from "../../core/domain/props";

export class UserRepositoryAdapter implements UserRepository {
	async create(user: User): Promise<void> {
		const data = userMapper.toPersistence(user);

		await prisma.user.create({
			data: {
				id: data.id,
				name: data.name,
				email: data.email,
				role: data.role,
				passwordHash: data.passwordHash,
				organization: {
					connect: {
						id: data.organizationId,
					},
				},
			},
		});
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = await prisma.user.findFirst({
			where: {
				email,
			},
		});

		if (!user) return null;
		return userMapper.toDomain(user);
	}

	async findById(id: bigint): Promise<User | null> {
		const user = await prisma.user.findUnique({
			where: { id },
		});

		if (!user) return null;
		return userMapper.toDomain(user);
	}

	async getUsers(
		organizationId: bigint,
		page?: number,
		perPage?: number,
	): Promise<PaginatedResult<UserProps>> {
		const skip = (page - 1) * perPage;

		const [accounts, total] = await prisma.$transaction([
			prisma.user.findMany({
				where: { organizationId },
				skip,
				take: perPage,
				orderBy: { createdAt: "desc" },
				omit: { passwordHash: true },
			}),
			prisma.user.count({
				where: { organizationId },
			}),
		]);

		const data = accounts.map((account) =>
			userMapper.toDomain(account).toProps(),
		);

		return {
			data,
			total,
		};
	}
}

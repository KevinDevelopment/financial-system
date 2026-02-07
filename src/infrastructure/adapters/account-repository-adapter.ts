import { Account } from "../../core/domain/entities/account";
import { AccountRepository } from "../../core/application/repositories";
import { prisma } from "../config";
import { accountMapper } from "../mappers/account-mapper";
import { PaginatedResult } from "../../core/application/shared";
import { AccountProps } from "../../core/domain/props";

export class AccountRepositoryAdapter implements AccountRepository {
	async create(account: Account): Promise<void> {
		const data = accountMapper.toPersistence(account);

		await prisma.account.create({
			data: {
				id: data.id,
				name: data.name,
				type: data.type,
				initialBalance: data.initialBalance,
				currentBalance: data.currentBalance,
				organizationId: data.organizationId,
				userId: data.userId,
			},
		});
	}

	async update(account: Account): Promise<void> {
		const data = accountMapper.toPersistence(account);

		await prisma.account.update({
			where: { id: data.id },
			data: {
				name: data.name,
				type: data.type,
				initialBalance: data.initialBalance,
				currentBalance: data.currentBalance,
			},
		});
	}

	async findById(accountId: bigint): Promise<Account | null> {
		const account = await prisma.account.findUnique({
			where: { id: accountId },
		});

		if (!account) return null;
		return accountMapper.toDomain(account);
	}

	async findByName(name: string, userId: bigint): Promise<Account | null> {
		const account = await prisma.account.findFirst({
			where: {
				name,
				userId,
			},
		});

		if (!account) return null;
		return accountMapper.toDomain(account);
	}

	async getAccounts(
		organizationId: bigint,
		page: number,
		perPage: number
	): Promise<PaginatedResult<AccountProps>> {

		const skip = (page - 1) * perPage;

		const [accounts, total] = await prisma.$transaction([
			prisma.account.findMany({
				where: { organizationId },
				skip,
				take: perPage,
				orderBy: { createdAt: "desc" }
			}),
			prisma.account.count({
				where: { organizationId }
			})
		]);

		const data = accounts.map(account =>
			accountMapper.toDomain(account).toProps()
		);

		return {
			data,
			total
		};
	}

}

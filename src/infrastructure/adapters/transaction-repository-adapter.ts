import { Transaction } from "../../core/domain/entities/transaction";
import { TransactionRepository } from "../../core/application/repositories/transaction-repository";
import { prisma } from "../config";
import { transactionMapper } from "../mappers";
import { PaginatedResult } from "../../core/application/shared";
import { TransactionProps } from "../../core/domain/props";

export class TransactionRepositoryAdapter implements TransactionRepository {
	public async create(transaction: Transaction): Promise<void> {
		const data = transactionMapper.toPersistence(transaction);

		await prisma.transaction.create({
			data: {
				id: data.id,
				amount: data.amount,
				type: data.type,
				status: data.status,
				paymentMethod: data.paymentMethod,
				createdAt: data.createdAt,
				categoryId: data.categoryId,
				description: data.description,
				userId: data.userId,
				accountId: data.accountId,
			},
		});
	}

	public async findByUserAndDescriptionAndDate(
		userId: bigint,
		description: string,
		createdAt: Date,
	): Promise<Transaction | null> {
		const transaction = await prisma.transaction.findFirst({
			where: {
				userId,
				description,
				createdAt,
			},
		});

		if (!transaction) return null;

		return transactionMapper.toDomain(transaction);
	}

	async getByAccount(
		accountId: bigint,
		page?: number,
		perPage?: number,
	): Promise<PaginatedResult<TransactionProps>> {
		const skip = (page - 1) * perPage;

		const [transactions, total] = await prisma.$transaction([
			prisma.transaction.findMany({
				where: { accountId },
				skip,
				take: perPage,
			}),
			prisma.transaction.count({
				where: { accountId },
			}),
		]);

		console.log(transactions);

		const data = transactions.map((transaction) =>
			transactionMapper.toDomain(transaction).toProps(),
		);

		console.log(data);

		return {
			data,
			total,
		};
	}
}

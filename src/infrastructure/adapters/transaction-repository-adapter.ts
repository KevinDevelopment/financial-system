import { Transaction } from "../../core/domain/entities/transaction";
import { TransactionRepository } from "../../core/application/repositories/transaction-repository";
import { prisma } from "../config";
import { transactionMapper } from "../mappers";

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
}

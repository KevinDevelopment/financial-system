import { Transaction } from "../../core/domain/entities/transaction";
import { TransactionRepository } from "../../core/application/repositories";
import { PaginatedResult } from "../../core/application/shared";
import { TransactionProps } from "../../core/domain/props";

export class InMemoryTransactionAdapter implements TransactionRepository {
	private readonly databaseInMemory: Array<Transaction> = [];

	async create(transaction: Transaction): Promise<void> {
		this.databaseInMemory.push(transaction);
	}

	async findByUserAndDescriptionAndDate(
		userId: unknown,
		description: string,
		createdAt: Date,
	): Promise<Transaction | null> {
		const transaction = this.databaseInMemory.find(
			(t) =>
				t.userId.value === userId &&
				t.description === description &&
				t.createdAt.getTime() === createdAt.getTime(),
		);

		if (!transaction) return null;
		return transaction;
	}

	async getByAccount(
		accountId: bigint,
		page?: number,
		perPage?: number,
	): Promise<PaginatedResult<TransactionProps>> {
		const filtered = this.databaseInMemory.filter(
			(t) => t.accountId.value === accountId,
		);

		const total = filtered.length;

		const start = (page - 1) * perPage;
		const end = start + perPage;

		const paginated = filtered.slice(start, end);

		const data = paginated.map((transaction) => transaction.toProps());

		return {
			data,
			total,
		};
	}
}

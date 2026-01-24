import { Transaction } from "../../core/domain/entities/transaction";
import { TransactionRepository } from "../../core/application/repositories";

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
}

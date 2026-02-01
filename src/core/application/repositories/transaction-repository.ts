import { Transaction } from "../../domain/entities/transaction";

export interface TransactionRepository {
	create(transaction: Transaction): Promise<void>;
	findByUserAndDescriptionAndDate(
		userId: unknown,
		description: string,
		createdAt: Date,
	): Promise<Transaction | null>;
}

import { Transaction } from "../../domain/entities/transaction";
import { TransactionProps } from "../../domain/props";
import { PaginatedResult } from "../shared";

export interface TransactionRepository {
	create(transaction: Transaction): Promise<void>;
	findByUserAndDescriptionAndDate(
		userId: unknown,
		description: string,
		createdAt: Date,
	): Promise<Transaction | null>;
	getByAccount(
		accountId: bigint,
		page?: number,
		perPage?: number,
	): Promise<PaginatedResult<TransactionProps>>;
}

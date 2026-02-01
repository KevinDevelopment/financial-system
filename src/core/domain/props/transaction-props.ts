export interface TransactionProps {
	userId: unknown;
    accountId: unknown;
	amount: number;
	type: number;
	status: number;
	paymentMethod: number;
	createdAt: Date;
	categoryId?: unknown;
	description?: string;
	id?: bigint;
}

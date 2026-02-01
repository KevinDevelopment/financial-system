export interface CreateTransactionInputDto {
	accountId: bigint;
	userId: bigint;
	amount: number;
	type: number;
	status: number;
	paymentMethod: number;
	categoryId?: bigint;
	description?: string;
}

export interface CreateTransactionOutputDto {
	id: bigint;
}

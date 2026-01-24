export interface CreateTransactionInputDto {
    accountId: bigint;
    userId: bigint;
    amount: number;
    type: number;
    status: number;
    paymentMethod: number;
    createdAt: Date;
    categoryId?: bigint;
    description?: string;
}

export interface CreateTransactionOutputDto {
    id: bigint;
}

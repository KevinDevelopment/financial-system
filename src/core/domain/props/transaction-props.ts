export interface TransactionProps {
    userId: unknown,
    ammount: number,
    type: number,
    status: number,
    paymentMethod: number,
    categoryId?: unknown,
    description?: string,
    id?: bigint
}
import { Transaction } from "../../core/domain/entities/transaction";

export const transactionMapper = {
    toPersistence(transaction: Transaction) {
        return {
            id: transaction.id.value,
            userId: transaction.userId.value,
            accountId: transaction.accountId.value,
            amount: transaction.amount.toCents(),
            type: transaction.type.value,
            status: transaction.status.value,
            paymentMethod: transaction.paymentMethod.value,
            createdAt: transaction.createdAt,
            categoryId: transaction.categoryId.value,
            description: transaction.description
        }
    },

    toDomain(row: any): Transaction {
        return Transaction.create({
            id: row.id,
            userId: row.userId,
            accountId: row.accountId,
            amount: row.ammount,
            type: row.type,
            status: row.status,
            paymentMethod: row.paymentMethod,
            createdAt: row.createdAt,
            categoryId: row.categoryId,
            description: row.description
        })
    }
}
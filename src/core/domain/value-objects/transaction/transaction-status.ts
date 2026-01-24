import { BusinessRuleViolationError } from "../../errors";
import { TransactionStatus as Transaction } from "../../entities/transaction/transaction-status";

export class TransactionStatus {
    private readonly _value: number;

    private constructor(value: Transaction) {
        this._value = value;
        Object.freeze(this);
    }

    public static create(value: number): TransactionStatus {
        if (!TransactionStatus.isValid(value)) {
            throw new BusinessRuleViolationError("status de transação inválido", 422);
        }

        return new TransactionStatus(value);
    }

    private static isValid(value: number): value is Transaction {
        return (
            value === Transaction.OPEN ||
            value === Transaction.PAID
        );
    }

    get value(): number {
        return this._value;
    }
}

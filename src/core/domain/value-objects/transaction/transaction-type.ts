import { BusinessRuleViolationError } from "../../errors";
import { TransactionType as Transaction } from "../../entities/transaction/transaction-type";

export class TransactionType {
    private readonly _value: number;

    private constructor(value: Transaction) {
        this._value = value;
        Object.freeze(this);
    }

    public static create(value: number): TransactionType {
        if (!TransactionType.isValid(value)) {
            throw new BusinessRuleViolationError("tipo de transação inválida", 422);
        }

        return new TransactionType(value);
    }

    private static isValid(value: number): value is Transaction {
        return (
            value === Transaction.INCOME ||
            value === Transaction.EXPENSE
        );
    }

    get value(): number {
        return this._value;
    }
}

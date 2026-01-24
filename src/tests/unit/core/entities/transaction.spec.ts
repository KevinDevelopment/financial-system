import { expect, test, describe, beforeEach } from "vitest";
import { TransactionProps } from "../../../../core/domain/props";
import { Transaction } from "../../../../core/domain/entities/transaction/transaction";
import { TransactionType } from "../../../../core/domain/entities/transaction/transaction-type";
import { TransactionStatus } from "../../../../core/domain/entities/transaction/transaction-status";
import { PaymentMethod } from "../../../../core/domain/entities/transaction/payment-method";
import { BusinessRuleViolationError } from "../../../../core/domain/errors";

let baseTransaction: TransactionProps;

beforeEach(() => {
    baseTransaction = Object.freeze({
        userId: 123456n,
        ammount: 150.75,
        type: TransactionType.EXPENSE,
        status: TransactionStatus.OPEN,
        paymentMethod: PaymentMethod.PIX,
        categoryId: 789n,
        description: "Compra de mercado",
    });
});

describe("entity transaction tests", () => {
    test("Should create a valid transaction if all values are provided", () => {
        const transaction = Transaction.create(baseTransaction);

        expect(transaction.userId.value).toEqual(123456n);
        expect(transaction.ammount.toDecimal()).toEqual(150.75);
        expect(transaction.type.value).toEqual(TransactionType.EXPENSE);
        expect(transaction.status.value).toEqual(TransactionStatus.OPEN);
        expect(transaction.paymentMethod.value).toEqual(PaymentMethod.PIX);
        expect(transaction.categoryId.value).toEqual(789n);
        expect(transaction.description).toEqual("Compra de mercado");
    });

    test("Should create a valid income transaction", () => {
        const transaction = Transaction.create({
            ...baseTransaction,
            type: TransactionType.INCOME,
        });

        expect(transaction.type.value).toEqual(TransactionType.INCOME);
    });

    test("Should create a valid transaction with PAID status", () => {
        const transaction = Transaction.create({
            ...baseTransaction,
            status: TransactionStatus.PAID,
        });

        expect(transaction.status.value).toEqual(TransactionStatus.PAID);
    });


    test("Should create a valid transaction with OPEN statu", () => {
        const transaction = Transaction.create({
            ...baseTransaction,
            status: TransactionStatus.OPEN,
        });

        expect(transaction.status.value).toEqual(TransactionStatus.OPEN);
    });


    test("Should create a valid transaction with CREDIT_CARD payment method", () => {
        const transaction = Transaction.create({
            ...baseTransaction,
            paymentMethod: PaymentMethod.CREDIT_CARD,
        });

        expect(transaction.paymentMethod.value).toEqual(PaymentMethod.CREDIT_CARD);
    });

    test("Should create a valid transaction with DEBIT_CARD payment method", () => {
        const transaction = Transaction.create({
            ...baseTransaction,
            paymentMethod: PaymentMethod.DEBIT_CARD,
        });

        expect(transaction.paymentMethod.value).toEqual(PaymentMethod.DEBIT_CARD);
    });

    test("Should create a valid transaction with CASH payment method", () => {
        const transaction = Transaction.create({
            ...baseTransaction,
            paymentMethod: PaymentMethod.CASH,
        });

        expect(transaction.paymentMethod.value).toEqual(PaymentMethod.CASH);
    });

    test("Should create a valid transaction with OTHER payment method", () => {
        const transaction = Transaction.create({
            ...baseTransaction,
            paymentMethod: PaymentMethod.OTHER,
        });

        expect(transaction.paymentMethod.value).toEqual(PaymentMethod.OTHER);
    });

    test("Should create a valid transaction without categoryId", () => {
        const transaction = Transaction.create({
            ...baseTransaction,
            categoryId: undefined,
        });

        expect(transaction.categoryId).toBeUndefined();
    });

    test("Should create a valid transaction without description", () => {
        const transaction = Transaction.create({
            ...baseTransaction,
            description: undefined,
        });

        expect(transaction.description).toBeUndefined();
    });

    test("Should return an error if description exceeds 255 characters", () => {
        const longDescription = "a".repeat(256);
        const transaction = () => {
            return Transaction.create({
                ...baseTransaction,
                description: longDescription,
            });
        };
        expect(transaction).toThrowError(
            new BusinessRuleViolationError(
                "Descrição não pode exceder 255 caracteres",
                422,
            ),
        );
    });

    test("Should create a valid transaction with description of exactly 255 characters", () => {
        const description = "a".repeat(255);
        const transaction = Transaction.create({
            ...baseTransaction,
            description: description,
        });

        expect(transaction.description).toEqual(description);
    });

    test("Should return an error if type is invalid", () => {
        const transaction = () => {
            return Transaction.create({ ...baseTransaction, type: 99 });
        };
        expect(transaction).toThrowError(
            new BusinessRuleViolationError("tipo de transação inválida", 422),
        );
    });

    test("Should return an error if status is invalid", () => {
        const transaction = () => {
            return Transaction.create({ ...baseTransaction, status: 99 });
        };
        expect(transaction).toThrowError(
            new BusinessRuleViolationError("status de transação inválido", 422),
        );
    });

    test("Should return an error if payment method is invalid", () => {
        const transaction = () => {
            return Transaction.create({ ...baseTransaction, paymentMethod: 99 });
        };
        expect(transaction).toThrowError(
            new BusinessRuleViolationError("método de pagamento inválido", 422),
        );
    });

    test("Should return an error if amount is not a number", () => {
        const transaction = () => {
            return Transaction.create({ ...baseTransaction, ammount: NaN });
        };
        expect(transaction).toThrowError(
            new BusinessRuleViolationError("Valor monetário inválido", 422),
        );
    });

    test("Should create a valid transaction if id is provided", () => {
        const transaction = Transaction.create({ ...baseTransaction, id: 999n });
        expect(transaction.id?.value).toEqual(999n);
    });

    test("Should create a valid transaction if id is not provided", () => {
        const transaction = Transaction.create(baseTransaction);
        expect(transaction.id).toBeDefined();
    });

    test("Should create a valid transaction with negative amount", () => {
        const transaction = Transaction.create({
            ...baseTransaction,
            ammount: -50.25,
        });
        expect(transaction.ammount.toDecimal()).toEqual(-50.25);
        expect(transaction.ammount.isNegative()).toBe(true);
    });

    test("Should create a valid transaction with zero amount", () => {
        const transaction = Transaction.create({
            ...baseTransaction,
            ammount: 0,
        });
        expect(transaction.ammount.toDecimal()).toEqual(0);
        expect(transaction.ammount.isZero()).toBe(true);
    });
});

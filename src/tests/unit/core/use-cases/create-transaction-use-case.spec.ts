import { expect, test, describe, beforeEach, vitest } from "vitest";
import {
    InMemoryAccountAdapter,
    InMemoryTransactionAdapter,
} from "../../../../infrastructure/in-memory";
import { CreateTransactionUseCase } from "../../../../core/application/use-cases/create-transaction-use-case";
import { Account } from "../../../../core/domain/entities/account";
import { AccountType } from "../../../../core/domain/entities/account/account-type";
import { TransactionType } from "../../../../core/domain/entities/transaction/transaction-type";
import { TransactionStatus } from "../../../../core/domain/entities/transaction/transaction-status";
import { PaymentMethod } from "../../../../core/domain/entities/transaction/payment-method";
import {
    DataAlreadyExistsError,
    MissingDataError,
} from "../../../../core/domain/errors";
import { CreateTransactionInputDto } from "../../../../core/application/dto";

let accountRepository: InMemoryAccountAdapter;
let transactionRepository: InMemoryTransactionAdapter;
let useCase: CreateTransactionUseCase;
let testAccount: Account;
let correctValues: CreateTransactionInputDto;

beforeEach(async () => {
    accountRepository = new InMemoryAccountAdapter();
    transactionRepository = new InMemoryTransactionAdapter();
    useCase = new CreateTransactionUseCase(
        accountRepository,
        transactionRepository,
    );

    // Criar e adicionar conta ao repositório
    testAccount = Account.create({
        name: "Conta Teste",
        type: AccountType.CHECKING,
        initialBalance: 1000,
        currentBalance: 1000,
        organizationId: 123n,
        userId: 456n,
    });
    await accountRepository.create(testAccount);

    // Definir valores corretos usando a conta criada
    correctValues = {
        accountId: testAccount.id.value,
        userId: 456n,
        amount: 150.5,
        type: TransactionType.EXPENSE,
        status: TransactionStatus.PAID,
        paymentMethod: PaymentMethod.PIX,       
        description: "Compra de mercado",
    };
});

describe("create transaction use case tests", () => {
    test("Should call the create method once with correct values", async () => {
        const spyMethodCreate = vitest.spyOn(transactionRepository, "create");
        await useCase.perform(correctValues);
        expect(spyMethodCreate).toBeCalledTimes(1);
    });

    test("Should call the account repository findById method once", async () => {
        const spyMethodFindById = vitest.spyOn(accountRepository, "findById");
        await useCase.perform(correctValues);
        expect(spyMethodFindById).toBeCalledTimes(1);
        expect(spyMethodFindById).toBeCalledWith(correctValues.accountId);
    });

    test("Should call the account repository update method once after creating transaction", async () => {
        const spyMethodUpdate = vitest.spyOn(accountRepository, "update");
        await useCase.perform(correctValues);
        expect(spyMethodUpdate).toBeCalledTimes(1);
    });

    test("Should update account balance when transaction is PAID and EXPENSE", async () => {
        const initialBalance = testAccount.currentBalance.toDecimal();
        await useCase.perform(correctValues);

        const updatedAccount = await accountRepository.findById(
            testAccount.id.value,
        );
        expect(updatedAccount.currentBalance.toDecimal()).toBe(
            initialBalance - correctValues.amount,
        );
    });

    test("Should update account balance when transaction is PAID and INCOME", async () => {
        const initialBalance = testAccount.currentBalance.toDecimal();
        const incomeTransaction: CreateTransactionInputDto = {
            ...correctValues,
            type: TransactionType.INCOME,
        };

        await useCase.perform(incomeTransaction);

        const updatedAccount = await accountRepository.findById(
            testAccount.id.value,
        );
        expect(updatedAccount.currentBalance.toDecimal()).toBe(
            initialBalance + incomeTransaction.amount,
        );
    });

    test("Should NOT update account balance when transaction is OPEN", async () => {
        const initialBalance = testAccount.currentBalance.toDecimal();
        const openTransaction: CreateTransactionInputDto = {
            ...correctValues,
            status: TransactionStatus.OPEN,
        };

        await useCase.perform(openTransaction);

        const updatedAccount = await accountRepository.findById(
            testAccount.id.value,
        );
        expect(updatedAccount.currentBalance.toDecimal()).toBe(initialBalance);
    });

    test("Should return an error if accountId is not provided", async () => {
        try {
            await useCase.perform({ ...correctValues, accountId: null as any });
        } catch (error) {
            expect(error).toBeInstanceOf(MissingDataError);
            expect(error?.message).toBe("Obrigatório informar a conta");
            expect(error?.status).toBe(400);
        }
    });

    test("Should return an error if account does not exist", async () => {
        try {
            await useCase.perform({ ...correctValues, accountId: 999999n });
        } catch (error) {
            expect(error).toBeInstanceOf(MissingDataError);
            expect(error?.message).toBe("Conta não encontrada");
            expect(error?.status).toBe(400);
        }
    });

    test("Should return an error if transaction already exists with same description and date", async () => {
        await useCase.perform(correctValues);

        try {
            await useCase.perform(correctValues);
        } catch (error) {
            expect(error).toBeInstanceOf(DataAlreadyExistsError);
            expect(error?.message).toBe("Transação já cadastrada");
            expect(error?.status).toBe(409);
        }
    });

    test("Should allow creating transaction without description", async () => {
        const spyMethodCreate = vitest.spyOn(transactionRepository, "create");
        await useCase.perform({
            ...correctValues,
            description: undefined,
        });

        expect(spyMethodCreate).toBeCalledTimes(1);
    });

    test("Should allow creating transaction without categoryId", async () => {
        const spyMethodCreate = vitest.spyOn(transactionRepository, "create");
        await useCase.perform({
            ...correctValues,
            categoryId: undefined,
        });

        expect(spyMethodCreate).toBeCalledTimes(1);
    });

    test("Should create transaction with all payment methods", async () => {
        const paymentMethods = [
            PaymentMethod.CREDIT_CARD,
            PaymentMethod.DEBIT_CARD,
            PaymentMethod.PIX,
            PaymentMethod.CASH,
            PaymentMethod.OTHER,
        ];

        for (const method of paymentMethods) {
            await useCase.perform({
                ...correctValues,
                paymentMethod: method,
                description: `Compra com método ${method}`,
            });
        }


        const spyMethodCreate = vitest.spyOn(transactionRepository, "create");
        expect(spyMethodCreate).toBeCalledTimes(0);
    });
});

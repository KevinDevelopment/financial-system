import { expect, test, describe, beforeEach } from "vitest";
import { AccountProps } from "../../../../core/domain/props";
import { Account } from "../../../../core/domain/entities/account";
import { AccountType } from "../../../../core/domain/entities/account/account-type";
import { BusinessRuleViolationError } from "../../../../core/domain/errors";
import { Money } from "../../../../core/domain/value-objects/account";

let baseAccount: AccountProps;

beforeEach(() => {
    baseAccount = Object.freeze({
        name: "Conta teste",    
        type: AccountType.CHECKING,
        initialBalance: 100.50,
        currentBalance: 100.50,
        organizationId: 656565n,
        userId: 123456n,
    });
});

describe("entity account tests", () => {
    test("Should create a valid account if values are provided", () => {
        const account = Account.create(baseAccount);

        expect(account.name.value).toEqual("Conta teste");
        expect(account.type.type).toEqual(AccountType.CHECKING);
        expect(account.initialBalance.toDecimal()).toEqual(100.50);
        expect(account.currentBalance.toDecimal()).toEqual(100.50);
        expect(account.organizationId.value).toEqual(656565n);
        expect(account.userId.value).toEqual(123456n);
    });

    test("Should return an error if name is not provided", () => {
        const account = () => {
            return Account.create({ ...baseAccount, name: "" });
        };
        expect(account).toThrowError(
            new BusinessRuleViolationError("Nome não pode ser vazio", 422),
        );
    });

    test("Should return an error if type is invalid", () => {
        const account = () => {
            return Account.create({ ...baseAccount, type: 99 });
        };
        expect(account).toThrowError(
            new BusinessRuleViolationError("tipo de conta inválida", 422),
        );
    }); 

    test("Should return an error if initial balance is not a number", () => {
        const account = () => {
            return Account.create({ ...baseAccount, initialBalance: NaN });
        };
        expect(account).toThrowError(
            new BusinessRuleViolationError("Valor monetário inválido", 422),
        );
    });

    test("Should return an error if current balance is not a number", () => {
        const account = () => {
            return Account.create({ ...baseAccount, currentBalance: NaN });
        };
        expect(account).toThrowError(
            new BusinessRuleViolationError("Valor monetário inválido", 422),
        );
    });

    test("Should create a valid account if id is provided", () => {
        const account = Account.create({ ...baseAccount, id: 123n });
        expect(account.id?.value).toEqual(123n);
    }); 

    test("Should create a valid account if id is not provided", () => {
        const account = Account.create(baseAccount);
        expect(account.id).toBeDefined();
    });
});

describe("value object money tests", () => {
    test("Should create Money from string value", () => {
        const money = Money.create("100.50");
        expect(money.toDecimal()).toEqual(100.50);
        expect(money.toCents()).toEqual(10050);
    });

    test("Should create Money from number value", () => {
        const money = Money.create(100.50);
        expect(money.toDecimal()).toEqual(100.50);
        expect(money.toCents()).toEqual(10050);
    });

    test("Should create Money from string with comma", () => {
        const money = Money.create("100,50");
        expect(money.toDecimal()).toEqual(100.50);
        expect(money.toCents()).toEqual(10050);
    });

    test("Should create Money from cents", () => {
        const money = Money.fromCents(10050);
        expect(money.toDecimal()).toEqual(100.50);
        expect(money.toCents()).toEqual(10050);
    });

    test("Should round decimal values correctly", () => {
        const money = Money.create("100.555");
        expect(money.toCents()).toEqual(10056);
    });

    test("Should add two Money values", () => {
        const money1 = Money.create("100.50");
        const money2 = Money.create("50.25");
        const result = money1.plus(money2);
        expect(result.toDecimal()).toEqual(150.75);
    });

    test("Should subtract two Money values", () => {
        const money1 = Money.create("100.50");
        const money2 = Money.create("50.25");
        const result = money1.minus(money2);
        expect(result.toDecimal()).toEqual(50.25);
    });

    test("Should identify positive value", () => {
        const money = Money.create("100.50");
        expect(money.isPositive()).toBe(true);
        expect(money.isNegative()).toBe(false);
        expect(money.isZero()).toBe(false);
    });

    test("Should identify negative value", () => {
        const money = Money.create("-100.50");
        expect(money.isPositive()).toBe(false);
        expect(money.isNegative()).toBe(true);
        expect(money.isZero()).toBe(false);
    });

    test("Should identify zero value", () => {
        const money = Money.create("0");
        expect(money.isPositive()).toBe(false);
        expect(money.isNegative()).toBe(false);
        expect(money.isZero()).toBe(true);
    });

    test("Should throw error for invalid string value", () => {
        const invalidMoney = () => Money.create("invalid");
        expect(invalidMoney).toThrowError(
            new BusinessRuleViolationError("Valor monetário inválido", 422),
        );
    });

    test("Should throw error for NaN value", () => {
        const invalidMoney = () => Money.create(NaN);
        expect(invalidMoney).toThrowError(
            new BusinessRuleViolationError("Valor monetário inválido", 422),
        );
    });

    test("Should handle zero cents", () => {
        const money = Money.fromCents(0);
        expect(money.isZero()).toBe(true);
        expect(money.toDecimal()).toEqual(0);
    });

    test("Should handle negative cents", () => {
        const money = Money.fromCents(-10050);
        expect(money.isNegative()).toBe(true);
        expect(money.toDecimal()).toEqual(-100.50);
    });
});
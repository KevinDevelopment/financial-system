import { BusinessRuleViolationError } from "../../errors";
import { AccountType as Account } from "../../entities/account/account-type";

export class AccountType {
    private readonly _value: number;

    private constructor(value: Account) {
        this._value = value;
        Object.freeze(this);
    }

    public static create(value: number): AccountType {
        if (!AccountType.isValid(value)) {
            throw new BusinessRuleViolationError("Role inválida", 422);
        }

        return new AccountType(value);
    }

    private static isValid(value: number): value is Account {
        return (
            value === Account.CHECKING ||
            value === Account.SAVINGS ||
            value === Account.DIGITAL_WALLET
        );
    }

    get type(): number {
        return this._value;
    }
}

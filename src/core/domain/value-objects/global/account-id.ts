import { BusinessRuleViolationError } from "../../errors";

export class AccountId {
    private constructor(private readonly _value: bigint) {
        Object.freeze(this);
    }

    public static create(value: unknown): AccountId {
        const parsed = AccountId.parse(value);

        if (parsed <= 0n) {
            throw new BusinessRuleViolationError("AccountId inválido", 422);
        }

        return new AccountId(parsed);
    }

    private static parse(value: unknown): bigint {
        if (value === null || value === undefined) {
            throw new BusinessRuleViolationError(
                "Obrigatório informar o usuário",
                422,
            );
        }

        if (typeof value === "bigint") {
            return value;
        }

        if (typeof value === "number") {
            if (!Number.isInteger(value)) {
                throw new BusinessRuleViolationError(
                    "AccountId deve ser um número inteiro",
                    422,
                );
            }
            return BigInt(value);
        }

        if (typeof value === "string") {
            if (!/^\d+$/.test(value)) {
                throw new BusinessRuleViolationError(
                    "AccountId deve ser um número inteiro válido",
                    422,
                );
            }
            return BigInt(value);
        }

        throw new BusinessRuleViolationError("AccountId inválido", 422);
    }

    get value(): bigint {
        return this._value;
    }
}

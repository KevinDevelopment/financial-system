import { BusinessRuleViolationError } from "../../errors";

export class CategoryId {
    private constructor(private readonly _value: bigint) {
        Object.freeze(this);
    }

    public static create(value: unknown): CategoryId {
        const parsed = CategoryId.parse(value);

        if (parsed <= 0n) {
            throw new BusinessRuleViolationError("CategoryId inválido", 422);
        }

        return new CategoryId(parsed);
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
                    "CategoryId deve ser um número inteiro",
                    422,
                );
            }
            return BigInt(value);
        }

        if (typeof value === "string") {
            if (!/^\d+$/.test(value)) {
                throw new BusinessRuleViolationError(
                    "CategoryId deve ser um número inteiro válido",
                    422,
                );
            }
            return BigInt(value);
        }

        throw new BusinessRuleViolationError("CategoryId inválido", 422);
    }

    get value(): bigint {
        return this._value;
    }
}
